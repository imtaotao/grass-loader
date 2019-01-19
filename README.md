# grass-loader 用于编译 grass 模板

## options
|    属性    | Description | Type | Default |
|------------|-------------|------|---------|
| lib | 需要用到的 grass 库 | string | @rustle/grass |
| needGrass  | 是否自动 import grass | boolean | false |

## template 字符与注释
用两种方法导出 template，通过注释的方式，会把需要的目标方法或字符串替换到特定的注释地方
1. template method <br>
```js
// #temp method
/* #temp method */

可以简写为：

// #temp
/* #temp */
```

2. template string <br>
```js
// #temp string
/* #temp string */
```

demo：
```html
<template>
  <div></div>
<template/>

<script>
export default function C () {
  return // #temp string
}
</script>
```

## 阻止编译
对于不想要参与编译的文件，可以通过 `// #no compile` 来阻止编译，但这行阻止编译的注释只能放在文件的最前面<br>
demo：
```js
// #no compile
...
```

## 几种 grass 文件的格式
1. 一种为 `template` 和 `script` 标签都齐全的文件格式，这个时候 `template` 注释才有作用
2. 如果只有 `template` 标签，那么这个标签会默认当成一个无状态组件，这个时候有两个属性供你使用，`name` 和 `styleSrc`
```html
<!-- name 为组件的名称 -->
<!-- styleSrc 为需要的 css 文件，需要开启 cssmodules, 这样就可以配合 grass 使用 styleName -->
<template name='cm' styleSrc='./style.css'>
  <div styleName='xx'></div>
</template>
```
3. 如果只有 `script` 标签，那么会作为纯 `js` 文件来处理，但，`needGrass` 配置同样生效
4. 对于纯 `js` 文件， `template` 和 `script` 标签都不存在的情况下，会跳过编译，`needGrass` 配置将不会生效


## 使用
demo：
```js
  {
    test: /\.grs$/,
    use: [
      {
        loader: 'grass-loader',
        options: {
          needGrass: true,
        },
      },
    ],
    exclude: /node_modules/,
  }
```

## 扩展
多以可以在 `grs` 文件中获得 `template` 字符串，当然可以可以进行更改
```html
<template>
  <div></div>
</template>

<script>
  const temp = (/* #temp string */)

  changeTemplate(temp)

  function changeTemplate (t) {
    console.log(t)
    ...
  }
</script>
```