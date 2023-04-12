module.exports = {
  mail: (email, token) => {
    return {
      from: "admin <virgiawanlr2@gmail.com>",
      to: `${email}`,
      subject: "Account verification",
      html: `<a href='http://localhost:3000/verification/${token}'>Click here to verify</a>`,
    };
  },
};
