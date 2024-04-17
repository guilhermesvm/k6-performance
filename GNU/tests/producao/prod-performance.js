import http from 'k6/http';
import { check, sleep } from 'k6';

/*import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
export function handleSummary(data) {
    return {
      "summaryProd.html": htmlReport(data),
    };
  }*/


export const options={
    vus: 100,
    duration: '30s',
    /*thresholds:{
        http_req_duration: ['p(95)<2000'], // 95% das requisicoes devem responder em ate 2s
        http_req_failed: ['rate<0.01'] // 1% das requisicoes podem falhar

    }*/
}

export default function () {
    const authUrl = 'https://api-app-producao.gnu.com.br/api/v1/authentication';
    const faqUrl = 'https://api-app-producao.gnu.com.br/api/v1/faq/categories';

    const payload = JSON.stringify ({
        login: '33383548007',
        password: '123456',
    });

    const authParams = {
        headers: {
            'Content-Type': 'application/json',
            'x-Api-Key': '3f80a0e4-a559-4cf6-93f1-f207a6b9a8a3'
        },
    };

    // POST AUTH
    const responseAuth = http.post(authUrl, payload, authParams);

   
    check(responseAuth, {
        'Auth 200': (r) => r.status === 200,
    });

    // GET TOKEN
    const accessToken = responseAuth.json().content.token;
    

    const faqParams = {
        headers: {
            'Content-Type': 'application/json',
            'x-Api-Key': '3f80a0e4-a559-4cf6-93f1-f207a6b9a8a3',
            'Authorization': `Bearer ${accessToken}`
        },
    };

    //GET FAQ
    const responseFaq = http.get(faqUrl, faqParams);
    sleep(1);

    check(responseFaq, {
        'Faq 200': (r) => r.status === 200,
    });
}
