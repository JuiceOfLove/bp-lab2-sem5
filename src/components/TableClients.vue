<template>
  <section class="clients">
    <div class="clients__wrapper p-4">
      <div class="table-title d-flex justify-content-between mb-3">
        <h3 class="d-inline-flex">Клиенты</h3>
        <div class="d-flex flex-row">
          <form class="me-3" role="search">
          <input
            v-model="search"
            type="search"
            class="form-control"
            placeholder="Поиск клиентов"
            aria-label="Search"
          />
        </form>
        <button
          type="button"
          @click="showModal = true"
          class="d-inline-flex align-items-center btn px-4 nav-pills"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          style="background-color: #74aa0e; color: white; border: gray;"
        >
          Добавить клиента
        </button>
        </div>
      </div>
      <div v-if="editId > -1" @submit.prevent="onSubmit" class="modal">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content p-2">
            <div class="modal-body row d-flex g-2">
              <div class="modal-header">
                <h5 class="modal-title fw-bold mb-0 fs-4">
                  Редактировать клиента
                </h5>
                <button
                  type="button"
                  class="btn btn-close"
                  @click="cancelChanges"
                ></button>
              </div>
              <div class="modal-body row g-2">
                <div class="form-floating">
                  <input
                    v-model="content.FirstName"
                    class="form-control rounded-3"
                    id="FirstName"
                  />
                  <label for="FirstName">Фамилия</label>
                </div>
                <div class="form-floating">
                  <input
                    v-model="content.MiddleName"
                    id="MiddleName"
                    class="form-control rounded-3"
                  />
                  <label for="MiddleName">Имя</label>
                </div>
                <div class="form-floating">
                  <input
                    id="LastName"
                    v-model="content.LastName"
                    class="form-control rounded-3"
                  />
                  <label for="LastName">Отчество</label>
                </div>
                <div class="form-floating">
                  <input
                    id="Phone"
                    v-model="content.Phone"
                    type="tel"
                    class="form-control rounded-3"
                    @input="validatePhone"
                  />
                  <label for="Phone">Телефон</label>
                  <div v-if="!phoneValid" class="text-danger">Неверный формат телефона</div>
                </div>
                <div class="form-floating">
                  <input
                    id="Email"
                    v-model="content.Email"
                    type="email"
                    class="form-control rounded-3"
                    @input="validateEmail"
                  />
                  <label for="Email">Email</label>
                  <div v-if="!emailValid" class="text-danger">Неверный формат email</div>
                </div>
                <div
                  class="form-floating align-self-end d-flex justify-content-end"
                >
                  <button
                    @click="cancelChanges"
                    class="w-40 mx-2 btn btn-secondary nav-pills"
                  >
                    Отмена
                  </button>
                  <button
                    class="w-40 mx-2 btn btn-primary nav-pills"
                    @click="saveChanges(editId)"
                    :disabled="!isValidForm"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table class="table table-striped shadow-sm">
        <thead>
          <tr>
            <th scope="col" class="table__item">id</th>
            <th scope="col" class="table__item">Фамилия</th>
            <th scope="col" class="table__item">Имя</th>
            <th scope="col" class="table__item">Отчество</th>
            <th scope="col" class="table__item">Телефон</th>
            <th scope="col" class="table__item">Почта</th>
            <th scope="col" class="table__item">Действия</th>
          </tr>
        </thead>
        <tbody class="table-hover">
          <tr
            v-for="client in filteredClients"
            :key="client.Id"
            :class="{ 'table-info': client.Id == editId }"
          >
            <td class="table__item">
              <p class="table__input">{{ client.Id }}</p>
            </td>
            <td class="table__item">
              <p class="table__input">{{ client.FirstName }}</p>
            </td>
            <td class="table__item">
              <p class="table__input">{{ client.MiddleName }}</p>
            </td>
            <td class="table__item">
              <p class="table__input">{{ client.LastName }}</p>
            </td>
            <td class="table__item">
              <p class="table__input">{{ client.Phone }}</p>
            </td>
            <td class="table__item">
              <p class="table__input">{{ client.Email }}</p>
            </td>
            <td>
              <div class="btn-group row">
                <button
                  class="btn-group__item"
                  @click="openModal = client.Id"
                >
                  Участие
                </button>
                <button
                  class="btn-group__item"
                  @click="editById(client.Id, client)"
                >
                  Изменить
                </button>
                <button
                  class="btn-group__item"
                  @click="deleteModal = client.Id"
                  :disabled="
                    checkId(client.Id, this.supplies) ||
                    checkId(client.Id, this.demands)
                  "
                >
                  Удалить
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ModalCreateClient v-if="showModal" @close="showModal = false" />
    <ModalOpen
      v-if="openModal > -1"
      :id="openModal"
      @close="openModal = -1"
      type="client"
    />
    <ModalProofDelete
      v-if="deleteModal > -1"
      @close="deleteModal = -1"
      @proof="removeById(deleteModal)"
      >выбранного клиента #<b>{{ deleteModal }}</b
      >?</ModalProofDelete
    >
  </section>
</template>

<script>
import { useClientsStore } from "../store/clients";
import { useDemandsStore } from "../store/demands";
import { useSuppliesStore } from "../store/supplies";
import levenshteinDistance from "../levenshtein.js";

import ModalCreateClient from "../components/ModalCreateClient.vue";
import ModalOpen from "./ModalOpen.vue";
import ModalProofDelete from "./ModalProofDelete.vue";

export default {
  components: {
    ModalCreateClient,
    ModalOpen,
    ModalProofDelete,
  },
  data() {
    return {
      phoneValid: true,
      emailValid: true,
      editId: -1,
      showModal: false,
      openModal: -1,
      deleteModal: -1,
      search: "",
      demands: useDemandsStore().demands,
      supplies: useSuppliesStore().supplies,
      content: {
        FirstName: "",
        LastName: "",
        MiddleName: "",
        Phone: "",
        Email: "",
        Id: 0,
      },
    };
  },
  computed: {
    isValidForm() {
      return !!(this.content.Phone && this.phoneValid) || this.content.Email;
    },
    filteredClients() {
      if (this.search !== "") {
        const searchWords = this.search.toLowerCase().split(" ");
        return useClientsStore().clients.filter((client) => {
          const fullName =
            `${client.FirstName} ${client.MiddleName} ${client.LastName}`.toLowerCase();

          // Check if any part of the full name is a fuzzy match for any search word
          return searchWords.some(
            (word) =>
              this.isFuzzyMatch(client.FirstName.toLowerCase(), word) ||
              this.isFuzzyMatch(client.MiddleName.toLowerCase(), word) ||
              this.isFuzzyMatch(client.LastName.toLowerCase(), word)
          );
        });
      }
      return useClientsStore().clients;
    },
  },
  methods: {
    validatePhone() {
    const phoneRegex = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;

    this.phoneValid = phoneRegex.test(this.content.Phone);

    if (!this.phoneValid) {
      console.warn("Неверный формат телефона. Пожалуйста, введите корректный номер телефона.");
    }
  },
  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    this.emailValid = emailRegex.test(this.content.Email);

    if (!this.emailValid) {
      console.warn("Неверный формат email. Пожалуйста, введите корректный email.");
    }
  },
    isFuzzyMatch(str1, str2) {
      const distance = levenshteinDistance(str1, str2);
      return distance <= 3;
    },
    removeById(id) {
      useClientsStore().removeClient(id);
    },
    editById(id, obj) {
      this.editId = id;
      this.content.FirstName = obj.FirstName;
      this.content.LastName = obj.LastName;
      this.content.MiddleName = obj.MiddleName;
      this.content.Phone = obj.Phone;
      this.content.Email = obj.Email;
      this.content.Id = obj.Id;
    },
    saveChanges(id) {
    this.validatePhone();
    this.validateEmail();

    if (this.phoneValid && this.emailValid) {
      this.editId = -1;
      useClientsStore().changeClient(id, this.content);
      console.log(id, this.content);
    }
  },
    cancelChanges() {
      this.editId = -1;
      this.content = {};
    },
    checkId(id, array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].ClientId === id) {
          return true;
        }
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.clients__wrapper {
  padding: 0 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.table__item {
  font-size: 18px;
}
.btn:disabled:hover {
  opacity: 0.5;
}
.table__input {
  font-size: 18px;
}

.btn-group__item:hover {
  background-color: rgb(72, 125, 217);
  color: #ffffff;
  width: 98%;
  border-radius: 15px;
}

.table__button {
  cursor: pointer;
  text-transform: uppercase;
  border: none;
  border-radius: 4px;
  padding: 10px 12px;
  width: 124px;
  text-align: center;
  margin-right: 2px;
  background-color: rgb(169, 169, 169);
}

.clients__wrapper {
    padding: 0 20px;
    max-width: 1440px;
    margin: 0 auto;
}

.row.g-2 {
    margin-bottom: 20px;
}

.form-floating {
    margin-bottom: 15px;

    label {
        color: #343a40;
    }

    input,
    select {
        background-color: #f8f9fa;
        color: #495057;
        border: 1px solid #ced4da;
        border-radius: 8px;

        &:focus {
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
    }
}

/* Table Styles */
.table {
    thead {
        th {
            background-color: #105498;
            color: white;
        }
    }

    tbody {
        tr {
            transition: background-color 0.3s;

            &:hover {
                background-color: #f8f9fa;
            }
        }

        td {
            color: #495057;
            font-weight: normal;
        }

        .table__item {
            padding: 8px 12px;
        }
    }

    .table-info {
        background-color: #d1ecf1;
    }

}

</style>
