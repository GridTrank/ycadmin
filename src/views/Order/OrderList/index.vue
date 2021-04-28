<template>
  <div class="bgfff">
    <commonInput 
    :searchFrom="searchFrom" 
    @batchModify="batchModify"
    @exportReport="exportReport"
    @search="search"
    @del="del"
    @add="add"
    :from="'productList'"
    ></commonInput>
    <!-- 表格 -->
    <!-- <commonTable 
    :tableData="tableData" 
    :count="count" 
    :columnData="columnData"
    :options="options"
    @edit="edit"
    @currentChange="currentChange"
    @sizeChange="sizeChange"
    @redirect="redirect"
    @select="select"
    @del="del"
    ></commonTable> -->
    <el-table :data="tableData" border>
      <el-table-column align="center" label="订单id" prop="order_id"></el-table-column>
      <el-table-column align="center" label="订单类型" prop="order_type"></el-table-column>
      <el-table-column align="center" label="订单状态" prop="order_status"></el-table-column>
      <el-table-column align="center" label="订单总额" prop="total_price"></el-table-column>
      <el-table-column align="center" label="下单时间" prop="create_time"></el-table-column>
      <el-table-column align="center" label="操作时间" prop="update_time"></el-table-column>
      <el-table-column align="center" label="下单用户" prop="store_name"></el-table-column>
    </el-table>
  </div>
</template>

<style lang="less" src="./index.less"></style>
<script src="./index.js"></script>