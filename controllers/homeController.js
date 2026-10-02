/**
 * Home Controller
 */

const getHomepage = async (req, res) => {
  try {
    res.render('index', {
      title: "Manjura's Aadaigal — Premium Indian Women's Fashion",
      description: "Discover exquisite Indian ethnic wear — sarees, kurtis, chudidars and more. Manjura's Aadaigal brings you the finest in women's Indian fashion.",
    });
  } catch (err) {
    console.error('Homepage error:', err);
    res.status(500).send('Server Error');
  }
};

const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.redirect('/?msg=invalid_email');
    }
    // TODO: Save to DB once Turso is connected
    console.log('Newsletter subscription:', email);
    res.redirect('/?msg=subscribed');
  } catch (err) {
    console.error('Newsletter error:', err);
    res.redirect('/?msg=error');
  }
};

module.exports = { getHomepage, subscribeNewsletter };
