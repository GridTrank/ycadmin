<template>
  <div class="bgfff home-wrap">
    <div class="home-top">
      <div>首页商品配置</div>
    </div>
    <div v-for="(item,index) in dataList" :key="index">
      <el-form :model="item">
        <el-form-item label="配置"  style="margin:30px">
          <el-select placeholder="选择商品" v-model="item.pid" style="margin-right:20px">
            <el-option
              v-for="(dd,di) in productList"
              :key="di"
              :label="dd.product_name"
              :value="dd.pid"
            ></el-option>
          </el-select>

          <el-select placeholder="选择类型" v-model="item.type"  style="margin-right:20px">
            <el-option label="顶部轮播" value="banner"></el-option>
            <el-option label="品牌甄选" value="recommend"></el-option>
            <el-option label="猜你喜欢" value="like"></el-option>
          </el-select>

          <el-upload
            :action="domain+'/product/productIndex'"
            :file-list="item.fileList"
            ref="upload"
            list-type="picture-card"
            :on-success="fileSuccess.bind(null,index)"
            :on-remove="fileRemove.bind(null,index)"
            :limit="1"
            name="imgSrc"
            style="display:inline-block;margin-right:20px"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-button type="primary" @click="del(index)">删除</el-button>

        </el-form-item>

      </el-form>
    </div>
    <el-button type="primary" @click="add">添加</el-button>
    <el-button type="primary" @click="save">保存</el-button>
  </div>
</template>

<style lang="less" src="./index.less"></style>
<script src="./index.js"></script>