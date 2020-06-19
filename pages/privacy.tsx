import { NextPage } from "next"
import Head from "next/head"
import Page from "../layouts/main"

const PrivacyPage: NextPage = () => {
  return (
    <Page>
      <Head>
        <title>Privacy - Joseph Duffy</title>
        <meta
          name="description"
          content="Privacy information for browsing the website"
        />
      </Head>
      <h1>Privacy</h1>
      <p>
        I take my own privacy seriously and in turn take the privacy practices
        of this website seriously.
      </p>
      <h2>Analytics</h2>
      <p>This website uses Matomo and NGINX logs to gather analytics.</p>
      <h3>Matomo Analytics</h3>
      <p>
        <a href="https://matomo.org/">Matomo</a> is used to gather client-side
        analytics. Matomo is configured to disable cookies and anonymise the
        last 2 bytes of IP addresses.
      </p>
      <h3>NGINX Logs</h3>
      <p>
        <a href="https://nginx.org/">NGINX</a> is used to serve the content of
        this website. NGINX access logs are kept on the server and analysed by{" "}
        <a href="https://goaccess.io/">GoAccess</a>.
      </p>
      <h3>Browsing without Analytics</h3>
      <p>
        If you wish to browse the website without Matomo tracking and access
        logging disabled please browse via{" "}
        <a href="https://noanalytics.josephduffy.co.uk">
          https://noanalytics.josephduffy.co.uk
        </a>
        or the Tor hidden service linked below.
      </p>
      <h2>3rd Party Content</h2>
      <p>
        All content is served by the domain you are browsing on; no 3rd party
        domains are used to load content.
      </p>
      <p>
        The website is built with various open-source projects and is
        open-source itself on GitHub. These 3rd party projects are used to
        enhance the experience while browsing the website and improve the
        development experience.
      </p>
      <p>
        If you wish to browse the website without downloading any 3rd party
        content it is possible to browse the website with JavaScript disabled.
      </p>
      <h2>Tor</h2>
      <p>
        This website does not contain any information that could be considered
        sensitive enough to warrant access via Tor, but I enjoy technology as a
        whole and have setup a Tor hidden service, which can be accessed at{" "}
        <a href="http://jduffyuk6evkttqy.onion">
          http://jduffyuk6evkttqy.onion
        </a>
        . This service bypasses nginx, does not log any requests, and does not
        have any form of analytics.
      </p>
    </Page>
  )
}

export default PrivacyPage
