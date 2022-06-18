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
      <h2>Browsing without Analytics or Logs</h2>
      <p>
        If you wish to browse the website without loading the Matomo script and
        with access logging disable please browse via{" "}
        <a href="https://noanalytics.josephduffy.co.uk" rel="nofollow">
          https://noanalytics.josephduffy.co.uk
        </a>{" "}
        or the Tor hidden service linked below.
      </p>
      <h2>3rd Party Content</h2>
      <p>
        hCaptcha is used to reduce spam on the contact form pages. They have{" "}
        <a
          href="https://www.hcaptcha.com/privacy"
          title="hCaptcha Privacy Policy"
        >
          their own privacy policy
        </a>
        .
      </p>
      <p>
        All other content is served by the domain you are browsing on with no
        3rd party domains used to load content.
      </p>
      <p>
        This website is built with various open-source projects and is
        open-source itself on GitHub. These 3rd party projects are used to
        enhance the experience while browsing the website and improve the
        development experience.
      </p>
      <p>
        If you wish to browse the website without downloading any 3rd party
        content it is possible to browse the website with JavaScript disabled.
      </p>
      <h3>Tor</h3>
      <p>
        This website does not contain any information that could be considered
        sensitive enough to warrant access via Tor, but I enjoy technology as a
        whole and have setup a Tor hidden service, which can be accessed at{" "}
        <a href="http://josephdepqbvoq7tm7uvynwmsji4354zmd3yp3rrtc245rilvq4ixayd.onion">
          josephdepqbvoq7tm7uvynwmsji4354zmd3yp3rrtc245rilvq4ixayd.onion
        </a>
        . This service bypasses NGINX and prevents the loading of the Matomo
        script.
      </p>
    </Page>
  )
}

export default PrivacyPage
