# Phone as salary

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen?style=flat-square)](/LICENSE)

Provide form and API that can make prank call with synthesized voice to your own phone number.

## Story

In Japanese old web comic "Mission-chan's Great Adventure", Main character who is called "Mission-chan" obtains a black rotary dial phone as salary. However, it can't make a call, so she can only receive calls from someone somewhere.

This repository is developed for the purpose of reproducing that item.

## Document

### Backend

Callings are made by API of [Twilio](https://www.twilio.com). For that reason, Deploy Serverless Functions that is written in TypeScript to [Vercel](https://vercel.com). These source codes are placed in the `api` directory.

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

The frontend consists TypeScript that is using [Vite](https://vitejs.dev) and [React](https://reactjs.org/). These source codes are placed in the `src` directory.

### How to run

At first, You have to install [Vercel CLI](https://vercel.com/docs/cli) and import this repository to [Vercel](https://vercel.com).

And You have to set following environment variables to Project. If you don't know how to set those, refer to [official document](https://vercel.com/support/articles/how-to-add-vercel-environment-variables).

- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TO (e.g. `+123456789`)
- FROM (e.g. `+123456789`)

Similarly, You have to set `Build & Development Settings` like following screenshot.

![screenshot](https://user-images.githubusercontent.com/43729396/154822289-4c950cb3-a9d2-4b4d-bd34-88dd227bc197.png)

Lastly, run following command.

```sh
vercel dev
```

#### Cautionary points

- Unless you are billionaire, You should disable automatic recharge of Twilio.
- To perpetuating logs, You have to install integration. I recommend [Flogtail](https://vercel.com/integrations/flogtail).
