<template>
  <header class="d-flex py-3">
    <div class="header__wrapper align-items-center d-flex justify-content-center flex-wrap">
      <ul class="nav nav-pills text-light" data-bs-theme="dark">
        <li class="nav-item"><router-link to="/clients" class="nav-link">Клиенты</router-link></li>
        <li class="nav-item"><router-link to="/rieltors" class="nav-link">Риэлторы</router-link></li>
        <li class="nav-item"><router-link to="/objects" class="nav-link">Недвижимость</router-link></li>
        <li class="nav-item"><router-link to="/offers" class="nav-link">Предложения</router-link></li>
        <li class="nav-item"><router-link to="/needs" class="nav-link">Потребности</router-link></li>
        <li class="nav-item"><router-link to="/deals" class="nav-link">Сделки</router-link></li>
      </ul>
    </div>
  </header>
</template>

<style>
:root {
  [data-bs-theme=dark] {
    color-scheme: dark;
  }
}

.header__wrapper {
  justify-content: space-between;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.nav-pills .nav-link {
  color: white;
  background-color: #2070bf; /* Background color for the nav-pills */
  margin: 0 5px;
  border-radius: 8px;
}

.nav-pills .nav-link:hover {
  background-color: #105498; /* Background color on hover */
}

.nav-pills .nav-link.active {
  background-color: #ffffff; /* Background color for the active nav-link */
  color: #000000; /* Text color for the active nav-link */
  font-weight: bold;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* Box shadow for the active nav-link */
}
</style>
