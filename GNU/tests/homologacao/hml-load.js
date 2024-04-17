import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
   stages: [
      { duration: "60s", target: 100 },
      { duration: "120s", target: 100 },
      { duration: "60s", target: 0 },
   ],
   thresholds: {
      http_req_duration: ["p(95)<2000"], // 95% das requisicoes devem responder em ate 2s
      http_req_failed: ["rate<0.01"], // 1% das requisicoes podem falhar
   },
};

export default function () {
   const authUrl =
      "https://api-app-homologacao.gnu.com.br/api/v1/authentication";
   const faqUrl =
      "https://api-app-homologacao.gnu.com.br/api/v1/faq/categories";

   const payload = JSON.stringify({
      login: "27229546052",
      password: "1231234",
   });

   const authParams = {
      headers: {
         "Content-Type": "application/json",
         "x-Api-Key": "761612b7-b751-4c25-87cd-ec745a2b342e",
      },
   };

   const responseAuth = http.post(authUrl, payload, authParams);

   check(responseAuth, {
      "Auth 200": (r) => r.status === 200,
   });

   const accessToken = responseAuth.json().content.token;

   const faqParams = {
      headers: {
         "Content-Type": "application/json",
         "x-Api-Key": "761612b7-b751-4c25-87cd-ec745a2b342e",
         Authorization: `Bearer ${accessToken}`,
      },
   };

   const responseFaq = http.get(faqUrl, faqParams);
   sleep(1);

   check(responseFaq, {
      "Faq 200": (r) => r.status === 200,
   });
}
