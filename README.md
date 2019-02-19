## 简介 

​	这是一个利用quagga js扫描条形码的项目。

​	有关quagga js可以访问[quagga](https://serratus.github.io/quaggaJS/官网

​	主要代码段是：

```javascript
Quagga.decodeSingle({
    //解码方式，与条形码的编码方式有关
    decoder: {
        readers: ["code_128_reader"] // List of active readers
    },
    locate: true, // try to locate the barcode in the image
    src: 'data:image/jpg;base64,' + imgData // or 'data:image/jpg;base64,' + data
}, function(result){
    if(result) {
        if(result.codeResult) {
            $("#result").val(result.codeResult.code);
        } else {
            $("#result").val("");
            alert("未扫码成功，请重新扫码!");
        }
    }else{
        alert("挂了!");
        $("#result").val("");
    }
    util.removeMask(); 
});
```
​	Quagga.decodeSingle(config, callback)；其中config是具体的配置信息，包括：

```javascript
{
  numOfWorkers: 4,
  locate: true,
  inputStream: {...},
  frequency: 10,
  decoder:{...},
  locator: {...},
  debug: false,
}
```

​	具体的解释可以查看quagga js的官网。

> 注意
>
> decoder的配置项中包涵解码的的方式，解码需要保证与条形码生成的编码方式一致，例如code 128，解码时需要设置为reader_128_code。可选择的方式有：
>
> *code_128_reader (default)
> *ean_reader
> *ean_8_reader
> *code_39_reader
> *code_39_vin_reader
> *codabar_reader
> *upc_reader
> *upc_e_reader
> *i2of5_reader
> *2of5_reader
> *code_93_reader

​	代码支持在手机端拉起摄像头进行条形码扫描。