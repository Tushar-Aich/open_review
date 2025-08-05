import {User} from '../models/user.model.js';
import axios from 'axios';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const updateAllUserStats = async () => {
  const users = await User.find({}, 'username');
  console.log(`Updating stats for ${users.length} users`);

  for (let i = 0; i < users.length; i++) {
    const username = users[i].username;

    try {
      const { data } = await axios.get(
        `https://api.chess.com/pub/player/${username}/stats`,
        {
            withCredentials: true,
            headers: {
                "Accept": "application/json"
            }
        }
    );

      const formatStats = (mode) => {
        const last = mode?.last || {};
        const record = mode?.record?.win + mode?.record?.loss + mode?.record?.draw;
        const best = mode?.best || {};

        return {
          rating: last.rating || 0,
          game: record || 0,
          win: mode?.record?.win || 0,
          loss: mode?.record?.loss || 0,
          draw: mode?.record?.draw || 0,
          best: best.rating || 0,
        };
      };

      const updatedStats = {
        'stats.blitz': formatStats(data.chess_blitz),
        'stats.rapid': formatStats(data.chess_rapid),
        'stats.bullet': formatStats(data.chess_bullet),
      };

      await User.updateOne({ username }, { $set: updatedStats });

      console.log(`[${i + 1}/${users.length}] Updated: ${username}`);
    } catch (err) {
      console.error(`❌ Error for ${username}: ${err.message}`);
    }

    await delay(2000); // wait 2 seconds to avoid rate limit
  }
};
