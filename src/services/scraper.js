const puppeteer = require("puppeteer");

async function scrapeDetails(url) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: await puppeteer.executablePath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  page.on("console", (msg) => {
    for (let i = 0; i < msg.args().length; ++i)
      console.log(`${i}: ${msg.args()[i]}`);
  });

  await page.goto(url, { waitUntil: "networkidle2" });

  const result = await page.evaluate(() => {
    const getMetaContent = (name) => {
      const meta = document.querySelector(`meta[name="${name}"]`);
      return meta ? meta.getAttribute("content") : null;
    };

    const getSocialHandle = (platform) => {
      const links = document.querySelectorAll(`a[href*="${platform}.com"]`);
      console.log(`Found ${links.length} links for ${platform}`);
      if (links.length > 0) {
        for (let link of links) {
          const href = link.href;
          console.log(`Checking link: ${href}`);
          const match = href.match(
            new RegExp(
              `(?:https?:\/\/)?(?:www\.)?${platform}\.com\/(?:@|#!/)?([\\w.]+)`
            )
          );
          if (match) {
            console.log(`Match found: ${match[1]}`);
            return href;
          }
        }
      }
      return null;
    };

    const getInnerText = (selector) => {
      const element = document.querySelector(selector);
      return element ? element.innerText.trim() : null;
    };

    const getAttribute = (selector, attribute) => {
      const element = document.querySelector(selector);
      return element ? element.getAttribute(attribute) : null;
    };

    return {
      name: getInnerText("title"),
      description: getMetaContent("description"),
      companyLogo: getAttribute("img", "src"),
      facebookURL: getSocialHandle("facebook"),
      linkedinURL: getSocialHandle("linkedin"),
      twitterURL: getSocialHandle("twitter"),
      instagramURL: getSocialHandle("instagram"),
      address:
        getInnerText("footer .footer-address") ||
        getInnerText(".address") ||
        getInnerText('[itemprop="address"]'),
      phoneNumber:
        getInnerText("footer .footer-phone") ||
        getInnerText(".phone") ||
        getInnerText('[itemprop="telephone"]'),
      email:
        getInnerText("footer .footer-email a") ||
        getInnerText(".email a") ||
        getInnerText('[itemprop="email"]'),
    };
  });

  await browser.close();
  return result;
}
const captureHomePageScreenshot = async (url) => {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: await puppeteer.executablePath(),
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    const screenshot = await page.screenshot({ fullPage: true });
    console.log("screenshot---------", screenshot);
    return screenshot;
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = { scrapeDetails, captureHomePageScreenshot };
