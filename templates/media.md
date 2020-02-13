<div v-for="a in articles" :key="a.id">

- <a :href="a.id">{{a.info.title}}</a>

  :date: {{a.info.date}}

</div>
