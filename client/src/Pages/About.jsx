import {useEffect} from 'react';
export default function About() {
  useEffect(()=>{
	  document.querySelector("body").scrollTo(0,0);
  },[])
  return (
    <div className="paragraph-container">
      <p className="paragraph">
      I am excited to announce the launch of my open-source project, a sentiment analysis tool that aggregates news sources from around the world to generate a happiness index. The project is built using a combination of Python Flask for the backend and React for the frontend. The primary goal of this project is to provide a unique perspective on global news consumption by analyzing the sentiment of news articles and providing an overall happiness score.
      </p>

      <p className="paragraph">
      The data collection process is fully automated, utilizing web scraping techniques to gather news articles at a scheduled time every morning, and subsequently analyzing the sentiment of the articles using natural language processing techniques. The resulting data is then visualized on an easy-to-use dashboard, providing users with a comprehensive understanding of the current global sentiment.
      </p>

      <p className="paragraph">
      As an open-source project, I welcome any contributions and suggestions from the community to improve and expand the capabilities of this tool. I undertake this project as a solo effort to sharpen my skills in web development, data analysis, and natural language processing. I believe that this project can provide valuable insights to both individuals and organizations alike, and I am excited to see the potential impact it can have on the way we consume and understand news.
      </p>

      <p className="paragraph">
      I would like to extend my sincerest appreciation to all users of this tool and the open-source community for their support.
      </p>
  </div>

  );
}
