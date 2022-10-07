### 2022年8月27日：创建项目

### 2022年8月28日：生成https密匙

[vite集成https，并安装本地自签名证书](https://zhuanlan.zhihu.com/p/551720193)

### 2022年9月3日：工程化设置

### 2022年9月15日：创建schema.prisma数据库模型

### 2022年9月16日：搭建routes大致框架

### 2022年9月17日：创建ts interface，编写/base/info逻辑代码，修改拦截器逻辑，`暂时弃用https`

### 2022年9月18日：全面弃用prisma级联，改为自己维护对应id。编写双向流覆盖日志输入流

### 2022年9月20日：恢复级联，将controller与service分离

### 2022年9月21日：编写info、comments、root代码逻辑，修改schema.prisma

### 2022年9月25日：编写files分片上传接口，解决`process.env.*`的ts报错问题，分离重构部分路由接口，修改部分model

### 2022年10月4日：准备由级联改为事务，重写所有已写功能

### 2022年10月5日：对于所有已编写接口进行了大规模重构，改为使用事务控制关系。编写share_file逻辑，编写部分user逻辑

### 2022年10月6日：编写user和blog逻辑，修改try...catch逻辑

### 2022年10月7日：编写shuoshuo逻辑，修复部分bug