# Youtube Grabber (ytmp3)


## Installation


```bash
npm install youtube-grabber
```

## Commands

| Command | Description |
|---------|-------------|
| nodemon | Listen on [http://localhost:3000](http://localhost:3000). (hot reload) |


## TIP

| Key | Value |
|-----|-------|
| id | Youtube video ID |
| type | mp3 or mp4 |

- URL - http://localhost:300/{id}/{type}
- Example URL - http://localhost:300/TpgwhHFH6Rw/mp4


## Proxy

~~~~
You can use with Puppeteer proxy.
See variables in index.js
~~~~

| Variable | Value |
|-----|-------|
| proxy | Default: false (Boolean) |
| proxy_ip | 8.8.8.8|
| proxy_host | 3001 |

## Success
~~~~
{
    success: true,
    url: 'https://jrr.fjrifj.frl/d5540ad54dd35591beef76ac25727074/tiEt1qkaaGA'
}
~~~~

## Error
~~~~
{
    success: false,
    statusCode: 100   
}
~~~~

| Status code | Description |
|-----------|-------|
| 100 | Something went wrong|
| 120 | Can't open URL|
| 101 | Not found input|
| 102 | Error block not found|
| 103 | Download link not found|
| 104 | Buttons not found|
| 105 | Progress timeout|
| 1101 | The servers are under maintenance.|
| 1102 | The video is blocked from converting due to a DMCA request.|
| 1103 | The video is no longer available on YouTube or the video is a live stream.|
| 1201 | The video is not available in our server location.|
| 1202 | The video is age restricted.|
| 1203 | The video is longer than 1 hour.|
| 1204 | There has been a conversion error.|