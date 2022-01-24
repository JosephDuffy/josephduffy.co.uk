import styles from "./VisitAppWebsite.module.css"
import { FunctionComponent } from "react"

interface Props {
  appName: string
  appURL: string
}

const VisitAppWebsite: FunctionComponent<Props> = ({
  appName,
  appURL,
}: Props): JSX.Element => {
  return (
    <a
      href={appURL}
      title={`Visit the marketing website for ${appName}`}
      referrerPolicy="origin"
    >
      <span className={styles["visit-website-badge"]}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="presentation"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
        </svg>
        Visit Website
      </span>
    </a>
  )
}

export default VisitAppWebsite
