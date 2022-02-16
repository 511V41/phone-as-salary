# Phone as salaly

Provide form and API that can make prank call with synthesized voice to your own phone number.

## Story

In Japanese old web comic "Mission-chan's Great Adventure", Main character who is called "Mission-chan" obtains a black rotary dial phone as salary. However, it can't make a call, so she can only receive calls from someone somewhere.

This repository is developed for the purpose of reproducing that item.

## Document

### Backend

Callings are made by API of [Twilio](https://www.twilio.com). For that reason, Deploy Serverless Functions that is written in TypeScript to [Vercel](https://vercel.com). These source codes are placed in the `api` directory.

#### Environment variable

The required environment variables are as follows.

- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TO (e.g. `+123456789`)
- FROM (e.g. `+123456789`)

#### How to run

To running on localhost, execute following command.

```sh
vercel dev
```

If you want to deploy, you have to import this repository to Vercel. After that, follow [official document](https://vercel.com/docs/concepts/deployments/overview).

#### endpoints

`POST /api/call`

```sh
# Example
curl -X POST -H "Content-Type: application/json" -d '{"message":"こんにちは世界"}' http://localhost:3000/api/call
```

Response is like following.

```json
{
  "sid": "foo"
}
```

`GET /api/status`

```sh
# Example
curl "http://localhost:3000/api/status?sid=foo"
```

Response is like following. Statuses are listed at [here](https://www.twilio.com/docs/voice/api/call-resource#call-status-values).

```json
{
  "status": "ringing"
}
```

### Frontend

*TODO*

~~The frontend consists TypeScript that is using [Vite](https://vitejs.dev) and [React](https://reactjs.org/). These source codes are placed in the `front` directory.~~

## Licence

The MIT License

```
Copyright 2022 511V41

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```