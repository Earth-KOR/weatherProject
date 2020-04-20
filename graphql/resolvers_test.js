const Weather = require('../model/weather');

module.exports = {
  getWeather: async function ({ userInput }, req) {
    // const city = req.params.city;

    try {
      //   let isData = await Weather.where({ city: city });

      //1. 없으면 서버에서 받아오고 DB에 한차례 저장한다.
      //   if (isData.length === 0) {
      // test API KEY 추후에 서비스 API로 바꾸고 환경변수로 설정해서 보호하기

      const apiKey = '58bd080d8d33adbba6bb6a3e644e9470';
      let apiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      const { data } = await axios.get(apiUrl);
      let weatherArr = [];
      let i = 0;
      console.log('데이터 읎다.');
      for (let d of data.list) {
        weatherArr[i] = {
          time: d.dt,
          temp: Math.floor(d.main.temp - 274),
          feels_like: Math.floor(d.main.feels_like - 274),
          weather: d.weather[0].main
        };
        console.log(d.weather[0].main);
        i++;
      }
      let weatherObj = new Weather({
        city: city,
        weather: weatherArr
      });
      await weatherObj.save();
      //   }
      // || 만약 DB에 있으면 DB에서 가져오기
      // DB에 저장하는 값은 우선 time: Date, temp: Number, feels_like: Number 이다
      const weather = await Weather.findOne({ city: city });
      // console.log(weather);

      //3. Json 데이터로 res를 보내준다.
      res.status(201).json(weather.weather);
    } catch (err) {
      console.log(err);
      err.message = '도시가 없습니다.';
      err.statusCode = 404;
      next(err);
    }
  }
};