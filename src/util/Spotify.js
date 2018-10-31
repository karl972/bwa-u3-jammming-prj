
const clientId = 'f8f704c34da0414ea835e286a1052a16';
const redirectUri = 'http://194.199.97.162:3000/callback';
let UaToken ='';

const Spotify = {
  search: async function (term) {
         this.getAccessToken();
         let url = `https://api.spotify.com/v1/search?type=track&q=${term}`;
         try {
             let response = await fetch(url, {
                 method: 'GET',
                 headers: {
                     'Authorization': 'Bearer ' + UaToken
                 }
             });
             if (response.ok) {
                 let jsonResponse = await response.json();
                 /*
                     ID — returned as track.id
                     Name — returned as track.name
                     Artist — returned as track.artists[0].name
                     Album — returned as track.album.name
                     URI — returned as track.uri
                 */
                 let tracks = jsonResponse.tracks.items.map(track => {
                     return {
                         ID: track.id,
                         artist: track.artists[0].name, Name: track.name, Album: track.album.name, URI: track.uri
                     }
                 })
                 return tracks;
             }
             throw new Error('Error on retrieving data from Spotify API');
         } catch (error) {
             console.log(error);
         }

     },
     savePlayList: async function (name, tracks) {
             this.getAccessToken();
             if (!tracks || name === undefined) {
                 return
             }

             try {
                 // Get user info
                 let headers = { 'Authorization': 'Bearer ' + UaToken };
                 let urlUserInfo = 'https://api.spotify.com/v1/me';
                 let response = await fetch(urlUserInfo, { headers: headers });

                 if (!response.ok) {
                     throw new Error('Fail to get user info');
                 }

                 let userInfo = await response.json();

                 // Create new playlist for user
                 headers = { ...headers, 'Content-Type': 'application/json' }
                 const urlPlaylist = `https://api.spotify.com/v1/users/${userInfo.id}/playlists`;

                 response = await fetch(
                     urlPlaylist,
                     {
                         method: 'POST',
                         headers: headers,
                         body: JSON.stringify({ name: name })
                     }
                 );

                 if (!response.ok) {
                     throw new Error('Fail to create playlist');
                 }

                 let playlistInfo = await response.json();
                 let playlistId = playlistInfo.id;
                 const urlPlaylistTracks = `https://api.spotify.com/v1/users/${userInfo.id}/playlists/${playlistId}/tracks`;
                 response = await fetch(
                     urlPlaylistTracks,
                     {
                         method: 'POST',
                         headers: headers,
                         body: JSON.stringify({ uris: tracks })
                     });
                 if (!response.ok) {
                     throw new Error('Fail to add tracks to playlist');
                 }
             } catch (error) {
                 console.log(error);
             }

         },
         getAccessToken()
         {
           if(UaToken)
             {return UaToken;}
           else if (window.location.href.match(/access_token=([^&]*)/) != null) {
                   UaToken = window.location.href.match(/access_token=([^&]*)/)[0].split("=")[1];
                   let expiresIn = window.location.href.match(/expires_in=([^&]*)/)[0].split("=")[1];
                   window.setTimeout(() => UaToken = '', expiresIn * 1000);
                   window.history.pushState('Access Token', null, '/');
               } else {
                   const authUri = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
                   console.log(authUri);
                   window.location.href = authUri;
               }
         }
   };




export default Spotify;
