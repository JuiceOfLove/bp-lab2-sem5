import { defineStore } from 'pinia'
import dataObjects from '../assets/objects.json';

export const useObjectsStore = defineStore('objects', {
  state: () => {
    return {
      objects: []
    }
  },
  actions: {
    changeObject(id, updatedObject) {
      const index = this.objects.findIndex(object => object.Id === id);
      if (index !== -1) {
        const updated = {...this.objects[index], ...updatedObject};
        this.objects.splice(index, 1, updated);
      }
    },
    async fetchObjects() {
      this.objects = dataObjects.map((object) => ({ ...object, district: '' }));
    },

    updateDistrict(id, district) {
      const index = this.objects.findIndex((object) => object.Id === id);
      if (index !== -1) {
        this.objects[index].district = district;
      }
    },

    addObject(object) {
      this.objects.push(object)
    },

    removeObject(id) {
        let arr = this.objects;
        this.objects = arr.filter(item => item.Id !== id)
    }
  }
})