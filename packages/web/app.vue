<template>
  <div>
    <button @click="handleClick">Click Me!</button>
  </div>
</template>

<script setup>
import axios from 'axios'

const handleClick = () => {
  console.log('Hello World!')
  axios.get('/api/v1/hello')
    .then(res => console.log(res))
    .catch(err => console.log(err))
}

</script>
