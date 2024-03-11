import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { JWTStrategy } from '@sap/xssec'
import { getServices } from '@sap/xsenv'
import * as passport from 'passport'

// const xsuaa = getServices({
//   xsuaa: { name: 'uaa_ExampleCustomCorePluginsMTA' },
// }).xsuaa
// passport.use(new JWTStrategy(xsuaa))

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: 'https://ce-dmc-prod-q8abbhhw.execution.eu20.dmc.cloud.sap',
  })
  // app.use(passport.initialize())
  // app.use(passport.authenticate('JWT', { session: false }))
  await app.listen(process.env.PORT || 3000)
}

bootstrap()
