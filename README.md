# URL shortener

Welcome everybody! My first backend project is a very simple URL shortener microservice!

You can also find this project in [repl.it](https://repl.it/@Yairderry/url-shortener)
let's get started!

## My Features

---

- **Custom URL** - My service allows you to customize the url you'll get, provided it's not taken of course.
- **statistics** - If you are a business that needs more information about your new shortened URL i got you covered as well, you can excess the statistics about it in the statistics tab. They include data about creation date and the amount of redirects to the URL(more statistics will be added in the future!).

### Preventing mistakes

- **Too short** - In the unlikely event where the url you want to short is already shorter than what i can give you, my server will detect it and let you know.
- **Tracking old URLs** - Let's say you are an old time user of my microservice, and you want to shorten a URL you already shortened, the service finds the url in the database and gives you the short URL with all of it's current stats!.
- **Valid URL** - We are not perfect OK? sometimes we have typos and that's cool, my service let's you know when you try to enter an invalid URL.
