"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: {
            credentials: true,
            origin: process.env.NODE_ENV === 'dev'
                ? 'http://localhost:5000'
                : 'http://api-tuyenduong.tuoitrebachkhoa.edu.vn',
        },
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('BK SCORM Authoring Platform API')
        .setDescription('The API for BK SCORM Authoring Platform.')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.use(cookieParser());
    await app.listen(process.env.PORT || 5001);
}
bootstrap();
//# sourceMappingURL=main.js.map