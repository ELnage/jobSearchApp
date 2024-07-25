export const confirmEmailTemplate = (name, link) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
   <style>

    div.email-temp {
      text-align: center;
      color: white;
      border-radius: 10px;
      padding: 15px;
      margin: auto;
      background-color: #009688;
    }
    h1 {
      word-spacing: 2px;
      letter-spacing: 2px;
    }
    h3{
      text-transform: capitalize;

    }
    a.email-link {
      text-decoration: none;
      color: white;
      margin: 20px auto;
      display: block;
      width: 50%;
      background-color: #000000;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 20px;
    }
    @media (max-width: 768px) {
      div.email-temp {
        width: 80%;
      }
    }
  </style>
</head>
<body>
  <div class="email-temp">
    <h1>
      Welcome to job search app
    </h1>
    <h3>hello ${name} please Confirm Your Email Address</h3>
    <p>Click the link below to confirm your email</p>
    <a class="email-link" href="${link}">Confirm</a>
  </div>

</body>
</html>
  `;
};

export const resetPasswordTemplate = (name, OTP) => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
   <style>

    div.email-temp {
      text-align: center;
      background-color: #E9ECEF;
      color: white;
      border-radius: 10px;
      padding: 15px;
      margin: auto;
      background:  linear-gradient(to top, #d3c4b5, #a68169);;
    }
    h1 {
      word-spacing: 2px;
      letter-spacing: 2px;
    }
    h3 , p{
      text-transform: capitalize;
      font-size: 18px;
    }

    span.otp {
    background-color: #e8e1d9;
    color: #000000; 
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
    padding: 20px; 
    border: 1px solid #a8a3a3; 
    border-radius: 10px;
    margin: 20px auto;
    font-weight: bold;
    font-size: 26px;
    letter-spacing: 5px;
    display: block;
    width: 50%;
}
    @media (max-width: 768px) {
      div.email-temp {
        width: 80%;
      }
    }
  </style>
</head>
<body>
  <div class="email-temp">
    <h1>
      Hello ${name} 
    </h1>
    <h3>Forget Your Password ?</h3>
    <p>No worry just use the OTP below To reset your password</p>
    <span class="otp">${OTP}</span>
  </div>

</body>
</html>
  `;
 }