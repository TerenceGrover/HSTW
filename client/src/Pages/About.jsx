import "./About.css";
import { AiFillApi, AiFillLinkedin} from "react-icons/ai";
import { BsDiscord, BsGithub } from "react-icons/bs";
export default function About() {
  return (
    <div className="paragraph-container">
      <nav className="mobile-nav">
        <div>
        <a href="#">
          <AiFillApi size={"30px"} />
        </a>
        <a href="https://www.linkedin.com/in/terence-grover-monaco/">
          <AiFillLinkedin size={"30px"}/>
        </a>
        <a href="#">
          <BsDiscord size={"30px"}/>
        </a>
        <a href="https://github.com/TerenceGrover/HSTW">
          <BsGithub size={"30px"}/>
        </a>
        </div>
      </nav>
      <div className="left">
        <div>
      <a href="#">
          API
          <AiFillApi size={"30px"} />
        </a>
        </div>
        <div>
        <a href="https://www.linkedin.com/in/terence-grover-monaco/">
          Linkedin
          <AiFillLinkedin size={"30px"} />
        </a>
        </div>
        <div>
        <a href="#">
          Discord
          <BsDiscord size={"30px"} />
          </a>
        </div>
        <div>
        <a href="https://github.com/TerenceGrover/HSTW">
          Github
          <BsGithub size={"30px"} />
          </a>
        </div>
      </div>
      <div className="right">
        <p className="paragraph">
          I am excited to announce the launch of my open-source project, a
          sentiment analysis tool that aggregates news sources from around the
          world to generate a happiness index. The project is built using a
          combination of Python Flask for the backend and React for the
          frontend. The primary goal of this project is to provide a unique
          perspective on global news consumption by analyzing the sentiment of
          news articles and providing an overall happiness score.
        </p>
        <p className="paragraph">
          The data collection process is fully automated, utilizing web scraping
          techniques to gather news articles at a scheduled time every morning,
          and subsequently analyzing the sentiment of the articles using natural
          language processing techniques. The resulting data is then visualized
          on an easy-to-use dashboard, providing users with a comprehensive
          understanding of the current global sentiment.
        </p>

        <p className="paragraph">
          As an open-source project, I welcome any contributions and suggestions
          from the community to improve and expand the capabilities of this
          tool. I undertake this project as a solo effort to sharpen my skills
          in web development, data analysis, and natural language processing. I
          believe that this project can provide valuable insights to both
          individuals and organizations alike, and I am excited to see the
          potential impact it can have on the way we consume and understand
          news.
        </p>

        <p className="paragraph">
          I would like to extend my sincerest appreciation to all users of this
          tool and the open-source community for their support.
        </p>
      </div>
    </div>
  );
}
