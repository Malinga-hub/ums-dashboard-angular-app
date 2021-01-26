import {HttpHeaders} from '@angular/common/http'

export const environment = {
  production: false,
  API_BASE_URL: "https://m-springboot-jwt-api.herokuapp.com/api",
  AUTH_HEADERS:  new HttpHeaders().set("Content-Type", "application/json"),
  MESSAGE_DURATION: 5000
};

// https://m-springboot-jwt-api.herokuapp.com/api
// "http://localhost:8082/api"

