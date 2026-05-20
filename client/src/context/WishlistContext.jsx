import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  // Store an object where keys are event IDs and values are true (for fast lookup)
  const [wishlistMap, setWishlistMap] = useState({});

  // Fetch wishlist when user logs in
  useEffect(() => {
    const fetchWishlist = async () => {
      const getLocalFallback = () => {
        try {
          const stored = localStorage.getItem('offlineWishlist');
          if (stored) {
            const parsed = JSON.parse(stored);
            return parsed && typeof parsed === 'object' ? parsed : {};
          }
        } catch (error) {
          console.warn('Failed to parse offline wishlist:', error.message);
        }
        return {};
      };

      if (user) {
        try {
          const { data } = await axios.get('/api/wishlist', {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          const map = {};
          if (Array.isArray(data)) {
            data.forEach((event) => {
              if (event && event._id) {
                map[event._id] = true;
              }
            });
          }
          setWishlistMap(map);
        } catch (error) {
          console.warn('Failed to fetch wishlist from server, using local fallback', error.message);
          setWishlistMap(getLocalFallback());
        }
      } else {
        // Fallback to local storage if offline or not logged in
        setWishlistMap(getLocalFallback());
      }
    };
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (event) => {
    const eventId = event._id;
    const isWishlisted = !!wishlistMap[eventId];

    // Optimistic UI update
    setWishlistMap((prev) => {
      const newMap = { ...prev };
      if (isWishlisted) {
        delete newMap[eventId];
      } else {
        newMap[eventId] = true;
      }
      
      // Always save to localStorage as a backup
      localStorage.setItem('offlineWishlist', JSON.stringify(newMap));
      return newMap;
    });

    // Notify user
    if (isWishlisted) {
      toast('Removed from Wishlist 💔', { icon: '💔' });
    } else {
      toast('Added to Wishlist ❤️', { icon: '❤️' });
    }

    // Backend update
    if (user) {
      try {
        await axios.post(
          `/api/wishlist/${eventId}`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      } catch (error) {
        console.warn('Failed to update wishlist on server, using offline fallback', error.message);
        // Do not revert, as it is already saved to localStorage in optimistic update
      }
    }
  };

  const isWishlisted = (eventId) => {
    return !!wishlistMap[eventId];
  };

  return (
    <WishlistContext.Provider value={{ wishlistMap, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};
