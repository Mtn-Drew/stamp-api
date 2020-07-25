# Stamp Champ API

![Project Image](https://drewcarrillo.com/img/mypics/art/sc-title.JPG
)

> Stamp Champ removes the need for tedious copy and pasting 

---

### Table of Contents


- [Description](#description)
- [How To Use](#how-to-use)
- [License](#license)
- [Author Info](#author-info)

---

## Description

Stamp Champ is a tool built for the Property and Title team at TESLA, though it has many uses beyond that application.  Stamp Champ lets the user create text snippets, and store them in buttons for quick and easy access.  An admin account can create a suite of 'stamps' or text snippets that can be shared to users without edit permissions.  At a call center, this is useful for adding case notes, but can also be used for emails, or anywhere the same text is used frequently.


#### Technologies

- React
- React-router
- Authorization and Authentication with JSON web tokens
- PostgreSQL
- Nodejs
- Express


This is the API backend for Stamp Champ.  Frontend can be found[here](https://github.com/Mtn-Drew/stamp-champ)

[Back To The Top](#stamp-champ)

---

## How To Use

#### Live Demo

https://stamp-champ.mtndrew.now.sh/


Stamp buttons are associated with a corresponding "profile" button (the middle row), which are in turn associated with "template" buttons, which make up the top row.  Clicking on the template or profile buttons reveals the profiles or stamps assigned to them.

#### Getting Started

First time users will need to create an account and sign in.  Once signed in, you can start creating custom stamps immediately.  Simply click 'Configure' to navigate to the Configuration page.

Here, you can create custom stamps, or edit/delete existing user created stamps.

You can also load pre-made templates.

![configuration-page](https://drewcarrillo.com/img/mypics/art/config12.JPG)

Once you have your stamps, using them is easy.  Just click and paste.

![click-and-paste](https://drewcarrillo.com/img/mypics/art/email.webp)

```html
    <p>dummy code</p>
```
[Back To The Top](#stamp-champ)

---

## License

MIT License

Copyright (c) [2020] [Drew Carrillo]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[Back To The Top](#stamp-champ)

---

## Author Info

- Website - [Drew Carrillo](https://www.drewcarrillo.com)
- [LinkedIn](https://www.linkedin.com/in/drew-dev-carrillo/)

[Back To The Top](#stamp-champ)
