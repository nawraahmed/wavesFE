export const mockPodcastData = {
  podcasts: [
    {
      podcast: {
        // Wrap the data inside the `podcast` object
        id: '96dd1fbfdhjf2882349eb019ab9dc7157367',
        title_original: 'In the Groove, Jazz and Beyond',
        thumbnail:
          'https://cdn-images-3.listennotes.com/podcasts/in-the-groove-jazz-and-beyond-ken-laster-Dvj70FPQ6e--rsp9Y3ySVgK.300x300.jpg',
        description_original: 'This is a mock description for the podcast.', // Add this mock description
        genre_ids: ['mock-genre-id'] // Provide a mock genre ID
      }
    },
    {
      podcast: {
        // Wrap the second podcast data as well
        id: 'cc01c37cc6b54nkjk5ebw5d3756fcae4cc9f0',
        title_original: 'Steve & Captain Evil: The Podcast',
        thumbnail:
          'https://cdn-images-3.listennotes.com/podcasts/steve-captain-evil-the-podcast-steve-trevino-UxPhWrwSEa0-0oH2E6CYAby.300x300.jpg',
        description_original: 'This is a mock description for the podcast.', // Add this mock description
        genre_ids: ['mock-genre-id'] // Provide a mock genre ID
      }
    }
  ]
}

export const fetchPodcastsMock = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPodcastData.podcasts)
    }, 1000) // Simulate network delay
  })
}

// podcast details
// mockApi.js
export const mockPodcastDetails = {
  id: 'c5c512d4b48a42f0acef83dd9615267c',
  title: 'Sivan Says: Taking the Torah Personally',
  publisher: 'Tablet Studios',
  image:
    'https://cdn-images-3.listennotes.com/podcasts/sivan-says-taking-the-torah-personally-NsxhDfT1LKi-u5JpkIDUH34.300x300.jpg',
  total_episodes: 32,
  description:
    'Each week, Israeli journalist and Torah scholar Sivan Rahav-Meir and Tablet’s own Liel Leibovitz discuss the week’s parsha, giving practical advice from our holiest book.',
  language: 'English',
  country: 'United States',
  episodes: [
    {
      id: '0e8f68f851394349afa9a7dbadfb35b7',
      title: 'Introducing Dreyfus: A Very Modern Affair',
      pub_date_ms: 1729035840000,
      audio:
        'https://audio.listennotes.com/e/p/0e8f68f851394349afa9a7dbadfb35b7/',
      audio_length_sec: 887,
      thumbnail:
        'https://cdn-images-3.listennotes.com/podcasts/sivan-says-taking/introducing-dreyfus-a-very-migeSxh56ZQ-DXI9OdYHPCc.300x300.jpg'
    },
    {
      id: '44bb98cf4f1e49cc8c840b46036d5e8d',
      title: 'Sukkot',
      pub_date_ms: 1729012716000,
      audio:
        'https://audio.listennotes.com/e/p/44bb98cf4f1e49cc8c840b46036d5e8d/',
      audio_length_sec: 1214,
      thumbnail:
        'https://cdn-images-3.listennotes.com/podcasts/sivan-says-taking-the-torah-personally-NsxhDfT1LKi-u5JpkIDUH34.300x300.jpg'
    },
    {
      id: 'a9d1f28ab5d246788b234db8319dbd80',
      title: 'Yom Kippur',
      pub_date_ms: 1728446400000,
      audio:
        'https://audio.listennotes.com/e/p/a9d1f28ab5d246788b234db8319dbd80/',
      audio_length_sec: 1111,
      thumbnail:
        'https://cdn-images-3.listennotes.com/podcasts/sivan-says-taking-the-torah-personally-NsxhDfT1LKi-u5JpkIDUH34.300x300.jpg'
    }
  ]
}

export const fetchPodcastDetailsMock = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPodcastDetails)
    }, 1000) // Simulate network delay
  })
}

//trending podcasts

export const fetchTrendingPodcastsMock = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        podcasts: [
          {
            id: 'a7208a3e2a654f999cf78c731824660a',
            title_original: 'My So-Called Midlife with Reshma Saujani',
            thumbnail:
              'https://cdn-images-3.listennotes.com/podcasts/my-so-called-midlife-with-reshma-saujani-Ln0GqrMDh7x-EPzDmBQtdVq.300x300.jpg'
          },
          {
            id: '62eeba8b05c44a829fcf77350bcc690e',
            title_original: 'The Man in the Black Mask',
            thumbnail:
              'https://cdn-images-3.listennotes.com/podcasts/the-man-in-the-black-mask-nbc-news-vhOEgrapAU6-wfYp9NBa07_.300x300.jpg'
          },
          {
            id: 'a7208a3e2a654f999cf78c731824660a',
            title_original: 'My So-Called Midlife with Reshma Saujani',
            thumbnail:
              'https://cdn-images-3.listennotes.com/podcasts/my-so-called-midlife-with-reshma-saujani-Ln0GqrMDh7x-EPzDmBQtdVq.300x300.jpg'
          },
          {
            id: '62eeba8b05c44a829fcf77350bcc690e',
            title_original: 'The Man in the Black Mask',
            thumbnail:
              'https://cdn-images-3.listennotes.com/podcasts/the-man-in-the-black-mask-nbc-news-vhOEgrapAU6-wfYp9NBa07_.300x300.jpg'
          },
          {
            id: 'a7208a3e2a654f999cf78c731824660a',
            title_original: 'My So-Called Midlife with Reshma Saujani',
            thumbnail:
              'https://cdn-images-3.listennotes.com/podcasts/my-so-called-midlife-with-reshma-saujani-Ln0GqrMDh7x-EPzDmBQtdVq.300x300.jpg'
          },
          {
            id: '62eeba8b05c44a829fcf77350bcc690e',
            title_original: 'The Man in the Black Mask',
            thumbnail:
              'https://cdn-images-3.listennotes.com/podcasts/the-man-in-the-black-mask-nbc-news-vhOEgrapAU6-wfYp9NBa07_.300x300.jpg'
          },
          {
            id: 'a7208a3e2a654f999cf78c731824660a',
            title_original: 'My So-Called Midlife with Reshma Saujani',
            thumbnail:
              'https://cdn-images-3.listennotes.com/podcasts/my-so-called-midlife-with-reshma-saujani-Ln0GqrMDh7x-EPzDmBQtdVq.300x300.jpg'
          },
          {
            id: '62eeba8b05c44a829fcf77350bcc690e',
            title_original: 'The Man in the Black Mask',
            thumbnail:
              'https://cdn-images-3.listennotes.com/podcasts/the-man-in-the-black-mask-nbc-news-vhOEgrapAU6-wfYp9NBa07_.300x300.jpg'
          },
          {
            id: 'a7208a3e2a654f999cf78c731824660a',
            title_original: 'My So-Called Midlife with Reshma Saujani',
            thumbnail:
              'https://cdn-images-3.listennotes.com/podcasts/my-so-called-midlife-with-reshma-saujani-Ln0GqrMDh7x-EPzDmBQtdVq.300x300.jpg'
          },
          {
            id: '62eeba8b05c44a829fcf77350bcc690e',
            title_original: 'The Man in the Black Mask',
            thumbnail:
              'https://cdn-images-3.listennotes.com/podcasts/the-man-in-the-black-mask-nbc-news-vhOEgrapAU6-wfYp9NBa07_.300x300.jpg'
          }
        ]
      })
    }, 1000) // Simulate network delay
  })
}
