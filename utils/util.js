var formatTime = function (cl) {
  return cl.map((item) => item.date = item.date.substring(0,10));
}

module.exports = {
  formatTime: formatTime
}
