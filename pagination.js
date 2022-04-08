//使用預設匯出
//匯出物件的結構跟vue元件一樣
export default {
    props: ['pages'],
    template:`<nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{disabled: !pages.has_pre}">
        <a class="page-link" href="#" 
        @click="$emit('get-product', pages.current_page -1)" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
                <!-- 把bs5的範例寫法刪掉改用v-for自己去跑 記得要搭配key -->
      <li class="page-item" 
        :class="{ active: page === pages.current_page}" 
        v-for="page in pages.total_pages" :key="page+'345'"> 
        <a class="page-link" href="#"
        @click="$emit('get-product', page)">{{page}}</a></li>
      <li class="page-item" :class="{disabled: !pages.has_next}">
        <a class="page-link" href="#" 
        @click="$emit('get-product', pages.current_page +1)" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`
}
