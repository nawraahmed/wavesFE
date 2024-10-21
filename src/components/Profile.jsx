import { useEffect, useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({
    favorites: [],
    playlists: [],
    podcastlist: [],
    episodes: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:4000/profile/details', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Pass token from localStorage
          },
        });
    
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
    
        const data = await response.json();
        setProfile(data); // Set the fetched profile data
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        alert('Error loading profile');
      }
    };
    

    fetchProfile();
  }, []);

  return (
    <div>
      <h1>User Profile</h1>
      <h4>Name:</h4>
      <p>{profile.username}</p>
      {/* <section>
        <h2>Favorites</h2>
        <ul>
          {profile.favorites.map((fav) => (
            <li key={fav.id}>{fav.title}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Playlists</h2>
        <ul>
          {profile.playlists.map((playlist) => (
            <li key={playlist.id}>{playlist.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Podcasts</h2>
        <ul>
          {profile.podcastlist.map((podcaslist) => (
            <li key={podcast.externalId}>
              <h3>{podcast.title}</h3>
              <p>{podcast.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Episodes</h2>
        <ul>
          {profile.episodes.map((episode) => (
            <li key={episode.id}>{episode.title}</li>
          ))}
        </ul>
      </section> */}
    </div>
  );
};

export default Profile;
