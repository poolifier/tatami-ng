# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.15](https://github.com/poolifier/tatami-ng/compare/0.8.14...0.8.15) (2025-01-29)


### 🐞 Bug Fixes

* median absolute deviation computation ([7779175](https://github.com/poolifier/tatami-ng/commit/7779175667e39496a08d79e1ff822cce6f3c97a1))


### 🤖 Automation

* **deps:** bump autofix-ci/action ([#48](https://github.com/poolifier/tatami-ng/issues/48)) ([e7e85f7](https://github.com/poolifier/tatami-ng/commit/e7e85f718a936b0c2f077eb3bb3ee438ffa6fb62))

## [0.8.14](https://github.com/poolifier/tatami-ng/compare/0.8.13...0.8.14) (2024-11-18)


### 🐞 Bug Fixes

* use performance.now() for timestamping with node ([0497b2c](https://github.com/poolifier/tatami-ng/commit/0497b2c79bec5da5164d16770e991b67e102d86a))


### ✨ Polish

* cleanup JS runtime detection code ([66310b4](https://github.com/poolifier/tatami-ng/commit/66310b4dc982de6e9708f279f954e22d990e18f1))
* refine browser JS runtime detection ([7537b2b](https://github.com/poolifier/tatami-ng/commit/7537b2ba3ac273eb50b99d184d1e9ac9deb4e3e5))

## [0.8.13](https://github.com/poolifier/tatami-ng/compare/0.8.12...0.8.13) (2024-10-27)


### 🐞 Bug Fixes

* fix throughput samples imputation in corner case ([8de3cc7](https://github.com/poolifier/tatami-ng/commit/8de3cc7805fb7d9df59151a9e163c99053bd3841))


### ✨ Polish

* avoid variable affectation ([eb35407](https://github.com/poolifier/tatami-ng/commit/eb35407a7fdbfa3b034cf72602116299d27f0079))


### 📚 Documentation

* **README.md:** add missing warmupTime options ([356d72d](https://github.com/poolifier/tatami-ng/commit/356d72d01a442d0f6230fdd1680e7d7bd35cd302))


### 🤖 Automation

* **ci:** handle various release type on npm registry ([7cf519d](https://github.com/poolifier/tatami-ng/commit/7cf519d5d0243541c42850673986a8cfd8b9d725))

## [0.8.12](https://github.com/poolifier/tatami-ng/compare/0.8.11...0.8.12) (2024-10-21)


### 🚀 Features

* add warmup minimum execution time option ([7718d34](https://github.com/poolifier/tatami-ng/commit/7718d341b9fe73cb4d0a6b56a827effd6e243a97))

## [0.8.11](https://github.com/poolifier/tatami-ng/compare/0.8.10...0.8.11) (2024-10-20)


### 🐞 Bug Fixes

* bind timestamping method to their modules once ([3cfcc9b](https://github.com/poolifier/tatami-ng/commit/3cfcc9ba527d635d08ad0943d5c488b5140a3e5c))


### ⚡ Performance

* bind timestamping functions to their module ([dffe3f0](https://github.com/poolifier/tatami-ng/commit/dffe3f0d06c854b9002ef89b0d97632d8cc32db7))

## [0.8.10](https://github.com/poolifier/tatami-ng/compare/0.8.9...0.8.10) (2024-10-19)


### ✨ Polish

* factor out statistics computation from samples ([3c2a41f](https://github.com/poolifier/tatami-ng/commit/3c2a41f3e811f40c1e96f93b7e3005f2b15c3063))

## [0.8.9](https://github.com/poolifier/tatami-ng/compare/0.8.8...0.8.9) (2024-10-18)


### 🚀 Features

* add after/before each function iteration hooks ([c7543ae](https://github.com/poolifier/tatami-ng/commit/c7543aed21a23651f5ae993669a623808330e1a5))


### ✨ Polish

* cleanup benchmark building ([aff9b96](https://github.com/poolifier/tatami-ng/commit/aff9b96eebc05761079e0628f051024947c4b854))


### 📚 Documentation

* refine measure() comment ([b3910a0](https://github.com/poolifier/tatami-ng/commit/b3910a0b6aeb03d8045d58ad997e616da9fb3a07))

## [0.8.8](https://github.com/poolifier/tatami-ng/compare/0.8.7...0.8.8) (2024-10-18)


### 🐞 Bug Fixes

* improve statistical accuracy ([ab1753f](https://github.com/poolifier/tatami-ng/commit/ab1753ff70e2d3c85e013b6fe9a7fe2c2273fadf))

## [0.8.7](https://github.com/poolifier/tatami-ng/compare/0.8.6...0.8.7) (2024-10-18)


### 🐞 Bug Fixes

* handle corner case promise like benchmark function ([ad9c3be](https://github.com/poolifier/tatami-ng/commit/ad9c3becc72359b8b89330fc324eef61040b84ba))
* promise like rejection without catch handling ([57de829](https://github.com/poolifier/tatami-ng/commit/57de82906b809f4949ba0e300a98409aa0c7a756))

## [0.8.6](https://github.com/poolifier/tatami-ng/compare/0.8.5...0.8.6) (2024-10-17)


### 🐞 Bug Fixes

* avoid duplicate benchmark run ([61c8eb2](https://github.com/poolifier/tatami-ng/commit/61c8eb297f6e88886cbb081a43c9acecf0ec62bb))

## [0.8.5](https://github.com/poolifier/tatami-ng/compare/0.8.4...0.8.5) (2024-10-16)


### 🐞 Bug Fixes

* properly handle nullish arg in isAsyncFunction() ([79aa988](https://github.com/poolifier/tatami-ng/commit/79aa98808c2969678657c0c9c5cb8bdb58d92c00))
* properly handle promises in benchmark ([f7ee29e](https://github.com/poolifier/tatami-ng/commit/f7ee29e737d3a78a2f0f2479bc543142b63a9137))


### ✨ Polish

* freeze Student tTable ([d7d3b8f](https://github.com/poolifier/tatami-ng/commit/d7d3b8f01f99c9771b815093e976314b58e0ccce))


### 📚 Documentation

* **README.md:** refine example code ([0d9762d](https://github.com/poolifier/tatami-ng/commit/0d9762d2c4f02afdb482880e7134b2818985c74d))

## [0.8.4](https://github.com/poolifier/tatami-ng/compare/0.8.3...0.8.4) (2024-10-10)


### 🐞 Bug Fixes

* handle divide by zero in throughput samples ([7d6d9fe](https://github.com/poolifier/tatami-ng/commit/7d6d9feb134ba5a5341537c5cb53c7a48ac5c582))


### ✨ Polish

* cleanup custom now() ([4b041d2](https://github.com/poolifier/tatami-ng/commit/4b041d269b5ddf4df13df00d1c403892f687fc76))


### 🤖 Automation

* **ci:** switch to deno 2.x.x ([cf495ef](https://github.com/poolifier/tatami-ng/commit/cf495efeaa1cf78c33dc5bf074bbb1f4c40f6eae))

## [0.8.3](https://github.com/poolifier/tatami-ng/compare/0.8.2...0.8.3) (2024-10-08)


### 🚀 Features

* add CommonJS support ([8825565](https://github.com/poolifier/tatami-ng/commit/88255658b563bf7d7a926ab524f341bab24f2241))

## [0.8.2](https://github.com/poolifier/tatami-ng/compare/0.8.1...0.8.2) (2024-10-04)


### 🐞 Bug Fixes

* refine latency MAD display and warning conditions ([ab2cf96](https://github.com/poolifier/tatami-ng/commit/ab2cf96fabcf18dfe0c1bf85296d796eebeb4261))
* refine throughput warning condition ([5d19f0a](https://github.com/poolifier/tatami-ng/commit/5d19f0a999411ee55029763a64eeeb8c0cf6552d))

## [0.8.1](https://github.com/poolifier/tatami-ng/compare/0.8.0...0.8.1) (2024-10-04)


### 🐞 Bug Fixes

* format iters/s warnings properly ([175d7f6](https://github.com/poolifier/tatami-ng/commit/175d7f65e86175e955d76972f906425555e34e87))

## [0.8.0](https://github.com/poolifier/tatami-ng/compare/0.7.4...0.8.0) (2024-10-04)


### ⚠ BREAKING CHANGES

* add custom benchmark reporter support
* untangle latency and throughput (stats, display, ...)

### 🚀 Features

* add custom benchmark reporter support ([4c16a3a](https://github.com/poolifier/tatami-ng/commit/4c16a3a7ccd865a957da83c9dc1883eb52a0f00b)), closes [#29](https://github.com/poolifier/tatami-ng/issues/29)


### 🐞 Bug Fixes

* fix reporter type definition ([6c2979c](https://github.com/poolifier/tatami-ng/commit/6c2979ce1fd0ec14820e3cfd5d856b8752c30111))


### ✨ Polish

* cleanup isFunction() helper implementation ([8c679f4](https://github.com/poolifier/tatami-ng/commit/8c679f485c7e9eaafed2a567d41d25fbdba5a681))
* untangle latency and throughput (stats, display, ...) ([683588f](https://github.com/poolifier/tatami-ng/commit/683588fe5a8b167b9fba2f68a95e6309a4e68b53))
* use isFunction() in more code paths ([57e0b32](https://github.com/poolifier/tatami-ng/commit/57e0b32940a31d294e1eff49d7120e17a9ed04e0))

## [0.7.4](https://github.com/poolifier/tatami-ng/compare/0.7.3...0.7.4) (2024-10-03)


### 🐞 Bug Fixes

* add upper/lower values to BMF throughput ([406e14b](https://github.com/poolifier/tatami-ng/commit/406e14b2341a38029fc0d7efeb673d9e6a696f38))
* fix BMF report upper/lower values ([0563f5b](https://github.com/poolifier/tatami-ng/commit/0563f5be27cffe522ecfd0a33c5b5a0cc0c3d423))


### ✨ Polish

* factor out function type detection helpers ([cada431](https://github.com/poolifier/tatami-ng/commit/cada431afae66f9b02b26653d699d761589aeaf6))
* major restructuration to ease pluggable features ([25ac409](https://github.com/poolifier/tatami-ng/commit/25ac40973a9b769d9052e1da19039a3c11662c76))
* **reporter:** simplify iters std dev computation ([c13fc14](https://github.com/poolifier/tatami-ng/commit/c13fc147080dff28644d7145a96f3020533099eb))
* untangle terminal display primitives from main code ([40638ae](https://github.com/poolifier/tatami-ng/commit/40638ae81a9fe1136457a637f65a91225839e0db))

## [0.7.3](https://github.com/poolifier/tatami-ng/compare/0.7.2...0.7.3) (2024-10-02)


### 🐞 Bug Fixes

* fix MAD display units ([6dea0b2](https://github.com/poolifier/tatami-ng/commit/6dea0b24f9983e5ead26583fbbea454a359c18a6))
* refine TS types definition ([4ca5068](https://github.com/poolifier/tatami-ng/commit/4ca50682382bf7d87882882cd97d2a26679dbe89))


### ✨ Polish

* cleanup warning message ([4f02f2e](https://github.com/poolifier/tatami-ng/commit/4f02f2ecadedecd1b64691d06929b045b3666981))

## [0.7.2](https://github.com/poolifier/tatami-ng/compare/0.7.1...0.7.2) (2024-10-01)


### 🚀 Features

* allow to define benchmark behavior at all levels ([a86ced9](https://github.com/poolifier/tatami-ng/commit/a86ced99e9fcddab3f38dcb2a2eca659a2863476))


### ✨ Polish

* display explicit warning about samples statistical ([82d08ea](https://github.com/poolifier/tatami-ng/commit/82d08ea6a495f9c9a30defd666cd8bebb02fd666))
* refine variable name ([ced909a](https://github.com/poolifier/tatami-ng/commit/ced909a458718fe7497d5bf7c0c7990609cfaf4d))
* use isObject() helper in more places ([d7f20f4](https://github.com/poolifier/tatami-ng/commit/d7f20f4da11e4c1a25ff3c5791902e97231bdd5a))

## [0.7.1](https://github.com/poolifier/tatami-ng/compare/0.7.0...0.7.1) (2024-09-30)


### 🐞 Bug Fixes

* add upper/lower values to BMF throughput report ([4555059](https://github.com/poolifier/tatami-ng/commit/455505948f086a891b37a1c625313fe31b970dbe))

## [0.7.0](https://github.com/poolifier/tatami-ng/compare/0.6.4...0.7.0) (2024-09-30)


### ⚠ BREAKING CHANGES

* rename iter/s to iters/s (like ops/s)

### ✨ Polish

* cleanup statistics helper arguments namespace ([846655b](https://github.com/poolifier/tatami-ng/commit/846655b8a35689d7632d3ad0c410029d2532d919))
* rename iter/s to iters/s (like ops/s) ([f188e81](https://github.com/poolifier/tatami-ng/commit/f188e812d479f7ba6664ce01ddd6e37d2ee75cf5))

## [0.6.4](https://github.com/poolifier/tatami-ng/compare/0.6.3...0.6.4) (2024-09-30)


### 🐞 Bug Fixes

* do not round timestamping ([bc2f605](https://github.com/poolifier/tatami-ng/commit/bc2f6050b28a8a1b1af6f92d617b515d744efe6c))


### ✨ Polish

* display MAD when necessary in p50 percentile ([4e42c6a](https://github.com/poolifier/tatami-ng/commit/4e42c6a93a33be3ff697f912212a9918db40a297))


### 📚 Documentation

* **README.md:** refine examples ([f811d56](https://github.com/poolifier/tatami-ng/commit/f811d56ee684f1425cefaf55305381d99fc4a732))
* refine documentation ([45a405e](https://github.com/poolifier/tatami-ng/commit/45a405e7dfcd571facf454965486fb8fa4be9776))

## [0.6.3](https://github.com/poolifier/tatami-ng/compare/0.6.2...0.6.3) (2024-09-29)


### 🐞 Bug Fixes

* fix benchmark related functions async detection ([038340c](https://github.com/poolifier/tatami-ng/commit/038340cb7c6caa90c2f300dc0b8060eda067d620))


### 📚 Documentation

* comment a bit benchmark stats data structure ([2bcd724](https://github.com/poolifier/tatami-ng/commit/2bcd7247a603e840c492a8b1b9b5aa6c5a403f49))

## [0.6.2](https://github.com/poolifier/tatami-ng/compare/0.6.1...0.6.2) (2024-09-29)


### 🚀 Features

* add average and median absolute deviation to stats ([cdf968a](https://github.com/poolifier/tatami-ng/commit/cdf968a226b4b4b0447fb99e4a659818f6940714))


### 🐞 Bug Fixes

* fix absolute deviation computation ([c2ad613](https://github.com/poolifier/tatami-ng/commit/c2ad613130f4650462945464b9c58fc21b7c9b4d))


### ✨ Polish

* cleanup quantile computation implementation ([8279e44](https://github.com/poolifier/tatami-ng/commit/8279e44a2e960ea26c007265807a3f668b48dda2))
* median() -&gt; medianSorted() ([850e46c](https://github.com/poolifier/tatami-ng/commit/850e46c9ad002f81ba1edd2529be571a8bb12d68))
* refine benchmark time measurement displaying ([c5e2c8e](https://github.com/poolifier/tatami-ng/commit/c5e2c8e032a5d2d9190638c6e9363fe74f1ab619))
* rename mean() -&gt; average() ([81749fb](https://github.com/poolifier/tatami-ng/commit/81749fb271b55aae0ed1dc508f50e611cf5d5301))

## [0.6.1](https://github.com/poolifier/tatami-ng/compare/0.6.0...0.6.1) (2024-09-29)


### 🐞 Bug Fixes

* call garbage collector before each benchmark ([21bdbf3](https://github.com/poolifier/tatami-ng/commit/21bdbf31163a06a2fc150561c265d8509994b5c3))
* fix gc() call on unknown JS runtime ([893f960](https://github.com/poolifier/tatami-ng/commit/893f960625771cf4e285d2f0df1b7436e9a7a20c))
* fix gc() implementation on Deno runtime ([b386e8a](https://github.com/poolifier/tatami-ng/commit/b386e8a384b4440184bcaa3c189b9a81911736ff))
* improve gc() detection on browser ([5146ef7](https://github.com/poolifier/tatami-ng/commit/5146ef7cec8d18dcea14c04adca5a49e18f5d813))
* try to run gc() with more JS runtimes ([1cef68c](https://github.com/poolifier/tatami-ng/commit/1cef68c0a63741f235bda86658dc14098313a1c7))


### ✨ Polish

* cleanup colors in output detection ([551df36](https://github.com/poolifier/tatami-ng/commit/551df3611ad3baf9a158e8dca3709eaf82cd1857))
* cleanup gc() implementation ([5ebe98a](https://github.com/poolifier/tatami-ng/commit/5ebe98a253f6e426090e31dd60569031297bfa08))
* cleanup variables namespace ([f84c010](https://github.com/poolifier/tatami-ng/commit/f84c010ef1a8be246fd4ee6279c5269e47b334cf))
* deno 2.x.x support ([fd39123](https://github.com/poolifier/tatami-ng/commit/fd39123a658af07c072070ee90e398147b65b97a))


### 📚 Documentation

* **README.md:** cleanup description ([93963cb](https://github.com/poolifier/tatami-ng/commit/93963cbba431394c2195d5acfdec415cf4931af9))
* **README.md:** refine description ([83fa873](https://github.com/poolifier/tatami-ng/commit/83fa873d116b5d7e933261f4587db86736fd664e))

## [0.6.0](https://github.com/poolifier/tatami-ng/compare/0.5.7...0.6.0) (2024-09-26)


### ⚠ BREAKING CHANGES

* remove clear() from the public API

### 🐞 Bug Fixes

* ensure unknown JS runtime has proper defaults ([5705403](https://github.com/poolifier/tatami-ng/commit/5705403b8664ea7795b7809c697fb27468afc6b3))
* make standalone CLI executable generation works on Windows™ ([50b3e6e](https://github.com/poolifier/tatami-ng/commit/50b3e6e2ca7311456529504c642bbfc1f6a8fb5e))
* remove clear() from the public API ([3bfdb3c](https://github.com/poolifier/tatami-ng/commit/3bfdb3c5a5cf52d11c4bca38766c3ba6c85d2b66))


### ✨ Polish

* cleanup deps for standalone binary generation ([3f2329a](https://github.com/poolifier/tatami-ng/commit/3f2329a5f6d827ba0c22be035e0430ad1b1498c1))
* cleanup test and cli building scripts usage ([44e5b93](https://github.com/poolifier/tatami-ng/commit/44e5b93493451533434aa479f7047b48cdc6f74a))
* enable `.editorconfig` in biome formatter￼ ([de27a2c](https://github.com/poolifier/tatami-ng/commit/de27a2c5e836de99e01d87f4e54b6bebd0de963f))
* refine package.json cli:* scripts ([20c9dfc](https://github.com/poolifier/tatami-ng/commit/20c9dfc7b36b9a2e55d507c650aa792ae7e7decf))


### 🤖 Automation

* **cli:** fix `build:cli` script recursion ([47aac22](https://github.com/poolifier/tatami-ng/commit/47aac2221aca0ad15298b45918ea36e2f66bded3))
* **cli:** run sequentially cli build scripts ([44d90e0](https://github.com/poolifier/tatami-ng/commit/44d90e0cf6fe73e1dd043f97ee438dfb3dd29287))
* sync bun packages lock file ([a064be1](https://github.com/poolifier/tatami-ng/commit/a064be1b89ecb56c3aa3000320a1a7868bbfe725))

## [0.5.7](https://github.com/poolifier/tatami-ng/compare/0.5.6...0.5.7) (2024-08-08)


### 📚 Documentation

* add deno CLI installation section ([dfd421c](https://github.com/poolifier/tatami-ng/commit/dfd421c1f75c44234797da57f795cf7ed7e9d358))

## [0.5.6](https://github.com/poolifier/tatami-ng/compare/0.5.5...0.5.6) (2024-08-08)


### 🚀 Features

* add bun single-file executable for CLI support ([7961789](https://github.com/poolifier/tatami-ng/commit/7961789f26fa29dafba50efc33ccf54251812c84))


### 🐞 Bug Fixes

* **cli:** print meaningful message if package.json not found ([bda431f](https://github.com/poolifier/tatami-ng/commit/bda431f21c0c0cdbd4bf9a63defaac1407320cf2))

## [0.5.5](https://github.com/poolifier/tatami-ng/compare/0.5.4...0.5.5) (2024-07-20)


### ✨ Polish

* make benchmarks more friendly with dark theme ([a85c9a6](https://github.com/poolifier/tatami-ng/commit/a85c9a6deab2a0c260c19fcc90cb588b4f059d8c))


### 📚 Documentation

* fix ms conversion to ps in units cheatsheet ([acd154a](https://github.com/poolifier/tatami-ng/commit/acd154ae9676bbfd728f9399bfe67580033e1db6))

## [0.5.4](https://github.com/poolifier/tatami-ng/compare/0.5.3...0.5.4) (2024-07-18)


### 🐞 Bug Fixes

* handle extrageanous space in CLI benchmarks ([8b50d44](https://github.com/poolifier/tatami-ng/commit/8b50d4463311b025810952f013be289446a545a5))
* make node sea generation works ([06fdc40](https://github.com/poolifier/tatami-ng/commit/06fdc40d901e7511350c1f84bd9c1536244855ec))
* make node sea works which n ([de36378](https://github.com/poolifier/tatami-ng/commit/de36378eb5b00a24aca67a9d0b5bda19ba1365ac))


### ✨ Polish

* add scripts for CLI binary generation ([82c15f5](https://github.com/poolifier/tatami-ng/commit/82c15f53af74ac3ba4423098d4923db6842371d5))
* npx -&gt; bunx where appropriates ([db7b392](https://github.com/poolifier/tatami-ng/commit/db7b392b26c45150feeee413458ecb3a3b26c5b4))

## [0.5.3](https://github.com/poolifier/tatami-ng/compare/0.5.2...0.5.3) (2024-07-11)


### 🚀 Features

* add node single executable application configuration ([e48ed77](https://github.com/poolifier/tatami-ng/commit/e48ed77fd53ae4e04bd6f7755f819cfac753dada))


### 🐞 Bug Fixes

* ensure CLI standalone binary includes required files ([1589024](https://github.com/poolifier/tatami-ng/commit/1589024f6468dc2b6efbee3599b7da890d4155cd))

## [0.5.2](https://github.com/poolifier/tatami-ng/compare/0.5.1...0.5.2) (2024-07-10)


### 🚀 Features

* allow to specify the number of warmup runs ([9f29086](https://github.com/poolifier/tatami-ng/commit/9f2908640bf9112f59908738795b9f7d4e2c468b))
* **cli:** allow to execute custom commands at benchmarking steps ([69c1fdc](https://github.com/poolifier/tatami-ng/commit/69c1fdc52d3c2818520d124014dc0ef48a9cff0c))


### ✨ Polish

* cleanup empty function usage ([007345d](https://github.com/poolifier/tatami-ng/commit/007345da0f00e0a39aa948e4e1a7ad96c3c71e3c))

## [0.5.1](https://github.com/poolifier/tatami-ng/compare/0.5.0...0.5.1) (2024-07-09)


### 📚 Documentation

* fix CLI usage documentation ([33735e3](https://github.com/poolifier/tatami-ng/commit/33735e3ff99721a6b672745e3f1213f2ca1768c5))

## [0.5.0](https://github.com/poolifier/tatami-ng/compare/0.4.16...0.5.0) (2024-07-09)


### ⚠ BREAKING CHANGES

* add CLI ([#8](https://github.com/poolifier/tatami-ng/issues/8))

### 🚀 Features

* add CLI ([#8](https://github.com/poolifier/tatami-ng/issues/8)) ([d20b094](https://github.com/poolifier/tatami-ng/commit/d20b0940891741ec04a510423aca0e6839559bee))


### 🐞 Bug Fixes

* ensure `file` write default JSON output to configured file ([394b033](https://github.com/poolifier/tatami-ng/commit/394b03323ecc030467011aaa0954a2a88ea87dc3))


### 📚 Documentation

* add ToC in README.md ([abd1504](https://github.com/poolifier/tatami-ng/commit/abd15047735b67e5b0f931d037a08a5244719c20))

## [0.4.16](https://github.com/poolifier/tatami-ng/compare/0.4.15...0.4.16) (2024-07-05)


### 🚀 Features

* switch to release-please release manager ([234f244](https://github.com/poolifier/tatami-ng/commit/234f244a679656c69c9b8b1a6bdab55c10a664c3))


### 📚 Documentation

* add PR template ([ad0fd01](https://github.com/poolifier/tatami-ng/commit/ad0fd01e378f01c0d7914cf20b0534da4d9f151b))
* refine README.md badges ([8fc2a37](https://github.com/poolifier/tatami-ng/commit/8fc2a373ff685dd59acd70be64b6b5c116eb8cb6))


### ✨ Polish

* **ci:** cleanup GH action ([ee255e7](https://github.com/poolifier/tatami-ng/commit/ee255e740160c9b09ceab165b8bfe89895d29b5e))
* refine GH action setup-bun configuration ([25382b6](https://github.com/poolifier/tatami-ng/commit/25382b696e162e8e35df37f033eefc53a859e40f))
* switch biome.js configuration to standard.js style ([5d9754a](https://github.com/poolifier/tatami-ng/commit/5d9754a7a395cecbd5e57080b4cf9b5e8b07f589))


### 🤖 Automation

* **ci:** add autofix GH action ([736c4f8](https://github.com/poolifier/tatami-ng/commit/736c4f839f1c75a36313922fe5ea8601ff181f7d))
* **ci:** do not cancel workflow on autofix.ci error ([d2b04dc](https://github.com/poolifier/tatami-ng/commit/d2b04dc873a996ecf119597e173041ac80f134a2))
* **ci:** fix setup-bun configuration ([a12a9d0](https://github.com/poolifier/tatami-ng/commit/a12a9d0dca53784c115f0327d29828da7c532831))
* **ci:** really ensure tag version is not prefixed with 'v' ([7dbb1be](https://github.com/poolifier/tatami-ng/commit/7dbb1be94f81c280acefd9c8b4ff14c17ec22584))
* **ci:** remove v prefix in release-please tag ([1aa36d1](https://github.com/poolifier/tatami-ng/commit/1aa36d13df2375c3367f56b4592bd65751f3a42d))
* **deps-dev:** apply updates ([51d9eea](https://github.com/poolifier/tatami-ng/commit/51d9eeafdd4fbb4427d053d067fb90300ce9a02e))
* **deps-dev:** apply updates ([e8d8302](https://github.com/poolifier/tatami-ng/commit/e8d8302f3ea0d8742419160cd75e9051288a39fe))
* **deps-dev:** apply updates ([8603c48](https://github.com/poolifier/tatami-ng/commit/8603c484dc691ac55660293880711e2d22aa03aa))
* **deps-dev:** apply updates ([0a7ace0](https://github.com/poolifier/tatami-ng/commit/0a7ace0fbd8fd9fe1d65fc15103106e726d67a3a))
* **deps-dev:** apply updates ([0785cfc](https://github.com/poolifier/tatami-ng/commit/0785cfcc6fa5e26056a10dd21fed3cebf0a1de3e))
* **deps-dev:** apply updates ([1f3034e](https://github.com/poolifier/tatami-ng/commit/1f3034e8f6a37f67225c111982849e4384af0392))
* **deps-dev:** apply updates ([b9bb1e0](https://github.com/poolifier/tatami-ng/commit/b9bb1e0de4e816cf385b9e759a45c13406171306))
* **deps:** bump oven-sh/setup-bun from 1 to 2 ([9c3fe1b](https://github.com/poolifier/tatami-ng/commit/9c3fe1b62ebe0eb05b3704fe1a5dc44b2347615c))

## [0.4.15] - 2024-06-16

### Fixed

- Fix a sanity check at benchmarks summary display.

## [0.4.14] - 2024-06-16

### Fixed

- Ensure benchmarks summary is only displayed with two valid benchmarks.

## [0.4.13] - 2024-05-25

### Changed

- Maintenance release.

## [0.4.12] - 2024-05-18

### Fixed

- Fix benchmark throughput computation.

## [0.4.11] - 2024-05-17

### Changed

- Add benchmark relative speed ratio error margin to summary.

## [0.4.10] - 2024-05-16

### Fixed

- Fix `run()` `warmup` option handling.
- Display summary for no group benchmarks.

## [0.4.9] - 2024-05-13

### Changed

- Add `file` to `run()` option allowing to save the JSON output to a file.

## [0.4.8] - 2024-05-13

### Fixed

- Ensure report returned by `run()` is not cleared.
- Fix `run()` `json` option handling.

## [0.4.7] - 2024-05-13 (not released)

### Fixed

- Ensure report returned by `run()` is not cleared.

## [0.4.6] - 2024-05-13

### Changed

- Add JSON BMF benchmark report format support to allow integration with [Bencher](https://bencher.dev/).

## [0.4.5] - 2024-05-11

### Changed

- Move benchmark options to `run()`.

## [0.4.4] - 2024-04-19

### Fixed

- Fix benchmark function JSDoc type definition.

### Changed

- Add `group()` asynchronous callback support.

## [0.4.3] - 2024-04-17

### Fixed

- Fix JSDoc API description.

## [0.4.2] - 2024-04-17

### Fixed

- Fix `bench()` and `baseline()` type definitions.

## [0.4.1] - 2024-04-16

### Fixed

- Fix browser support.

## [0.4.0] - 2024-04-15

### Fixed

- Fix ESM browser export.

### Changed

- BREAKING CHANGE: rename the default exported file to a more de facto
  standardized namespace. Usage in browser is impacted.

## [0.3.4] - 2024-04-14

### Added

- Add releasing on JSR.

## [0.3.3] - 2024-04-14

### Fixed

- Fix rate computation and formatting in summary.
- Less biased timestamp rounding.
- Refine minimum number of samples for Student t-distribution.

## [0.3.2] - 2024-04-13

### Changed

- Add accurate two-tailed Student t-distribution table for 95% confidence level.

## [0.3.1] - 2024-04-12

### Fixed

- Ensure default minimum samples guarantee statistical significance.

## [0.3.0] - 2024-04-10

### Fixed

- Fix statistical significance threshold value and reporting in JSON.

### Changed

- Add error margin to report.
- Remove IQR filtering since error margin permits to evaluate the results
  statistical significance.
- BREAKING CHANGE: rename in JSON report `std` to `sd` for the standard
  deviation.
- BREAKING CHANGE: switch percentile p999 to p995 in report.

## [0.2.3] - 2024-04-08

### Fixed

- Align `iter/s` with `time (avg)` formatting.

### Changed

- Add median (p50) to console output.

## [0.2.2] - 2024-04-08

### Changed

- Optimize benchmark statistics computation.

## [0.2.1] - 2024-04-07

### Changed

- Add `time: number` to `run()` options specifying the minimum benchmark time in
  nanoseconds.

## [0.2.0] - 2024-04-07

### Fixed

- Fix `measure()` asynchronous implementation.
- Fix percentiles computation.
- Fix inconsistent benchmark behavior: the samples statistical significance
  shall be done on the same measurement base.

### Changed

- Add `clear()` benchmark clearing primitive.
- Optimize JavaScript runtime environment detection code (constify environment
  variables).
- Add IQR samples outlier detection and removal.
- Add standard deviation to JSON report.
- Add `samples: number` to `run()` options specifying the minimum number of
  benchmark samples.
- Add
  `options: { before: () => void | Promise<void>; after: () => void | Promise<void> }`
  to `bench()` and `baseline()` specifying callbacks to run before and after the
  benchmark.
- Add
  `options: { before: () => void | Promise<void>; after: () => void | Promise<void> }`
  to `group()` specifying callbacks to run before and after the group.
- Add `iter/s` to report.
- Add package publication GitHub workflow.

## [0.1.11] - 2024-02-20
