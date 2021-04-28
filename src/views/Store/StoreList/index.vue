<template>
  <div class="warnlist-wrap main-warp">
    <commonInput 
    :searchFrom="searchFrom" 
    @search="search"
    @del="del"
    @add="add"
    :from="'productList'"
    ></commonInput>
    <!-- 表格 -->
    <commonTable 
    :tableData="tableData" 
    :count="count" 
    :columnData="columnData"
    :options="options"
    @edit="edit"
    @currentChange="currentChange"
    @sizeChange="sizeChange"
    @select="select"
    @del="del"
    ></commonTable>

    <el-dialog :title="diaTitle" :visible="dialogTableVisible" @close="dialogTableVisible=false" width="40%">
      <el-form :model="storeData" label-width="150px">
        <el-form-item label="店铺名称：" >
          <el-input v-model="storeData.store_name" placeholder="请输入店铺名称" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="用户账号：" >
          <el-input v-model="storeData.user_name" placeholder="请输入店铺名称" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="用户密码：" >
          <el-input v-model="storeData.pass_word" placeholder="请输入店铺名称" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" >
          <el-input v-model="storeData.mobile" placeholder="请输入店铺名称" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="店铺等级：" >
          <el-select v-model="storeData.role_level">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="官网" value="2"></el-option>
            <el-option label="商家店铺" value="3"></el-option> 
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<style lang="less" src="./index.less"></style>
<script src="./index.js"></script>