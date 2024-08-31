<template>
    <footer class="blog-footer">
      <p><a href="">Powered by ElderCare Group Ptv Ltd 2024</a>.</p>
      <p>
        <a href="#">Back to top</a>
      </p>
    </footer>
  </template>
  
  <script>
  export default {
    // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
    name: 'Footer',
  };
  </script>
  
  <style scoped>
  .blog-footer {
    padding: 2.5rem 0;
    color: #999;
    text-align: center;
    background-color: #f9f9f9;
    border-top: .05rem solid #e5e5e5;
  }
  
  .blog-footer p:last-child {
    margin-bottom: 0;
  }
  </style>
  