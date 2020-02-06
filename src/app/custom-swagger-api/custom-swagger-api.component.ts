import { Component, OnInit, ElementRef } from '@angular/core';
declare const SwaggerUIBundle: any;

@Component({
  selector: 'app-custom-swagger-api',
  templateUrl: './custom-swagger-api.component.html',
  styleUrls: ['./custom-swagger-api.component.css']
})
export class CustomSwaggerApiComponent implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    const ui = SwaggerUIBundle({
      dom_id: '#swagger-editor',
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      url: 'https://petstore.swagger.io/v2/swagger.json',
      docExpansion: 'none',
      operationsSorter: 'alpha'
    });
  }
}
