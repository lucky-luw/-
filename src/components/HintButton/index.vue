<template>
<!-- 这是个自定义组件，button有提示 ，使用a标签使有提示-->
    <a :title="title" style="margin:10px">
        <el-button v-bind="$attrs" v-on="$listeners"></el-button>
    </a>
</template>

<script>
export default {
    name:'HintButton',
    props:['title']
}
//用户在使用该组件时，要给该组件传相应的参数，$attrs时组件实例属性，可以获取到父组件传过来的props数据，若用props接收，那再$attrs中就没有了
//$listeners可以获取父组件给子组件传递的自定义事件
</script>

<style>

</style>