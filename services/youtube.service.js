'use strict';

const { google } = require('googleapis');

const generateVideoLinks = (items, playlistId) => {
    return items.map((item) => {
        return {
            url: `https://www.youtube.com/watch?v=${
                item.contentDetails.videoId
            }&list=${playlistId}&index=${item.snippet.position + 1}`,
            title: item.snippet.title,
        };
    });
};

exports.getPlaylistVideos = async (playlistId) => {
    const playlistItems = {
        videos: [],
        playlist: `https://www.youtube.com/playlist?list=${playlistId}`,
    };

    const service = google.youtube({
        version: 'v3',
        auth: process.env.GOOGLE_API_KEY,
    });

    return new Promise((resolve, reject) => {
        service.playlistItems
            .list({
                part: 'snippet,contentDetails',
                playlistId: playlistId,
                maxResults: 50,
            })
            .then((res) => {
                const videos = generateVideoLinks(res.data.items, playlistId);

                playlistItems.videos = [...playlistItems.videos, ...videos];

                if (res?.data?.nextPageToken) {
                    service.playlistItems
                        .list({
                            part: 'snippet, contentDetails',
                            playlistId: playlistId,
                            pageToken: res.data.nextPageToken,
                            maxResults: 50,
                        })
                        .then((res) => {
                            const videos = generateVideoLinks(
                                res.data.items,
                                playlistId
                            );

                            playlistItems.videos = [
                                ...playlistItems.videos,
                                ...videos,
                            ];

                            resolve(playlistItems);
                        })
                        .catch((err) => {
                            console.log(`The API returned an error: ${err}`);
                            reject(err);
                        });
                } else {
                    resolve(playlistItems);
                }
            })
            .catch((err) => {
                console.log(`The API returned an error: ${err}`);
                reject(err);
            });
    });
};
