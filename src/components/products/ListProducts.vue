<template>
  <q-markup-table v-if="productStore.skeleton">
    <thead>
      <tr>
        <th class="text-left" style="width: 150px">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="n in 5" :key="n">
        <td class="text-left">
          <q-skeleton animation="blink" type="text" width="85px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="50px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="35px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="65px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="25px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="85px" />
        </td>
      </tr>
    </tbody>
  </q-markup-table>
  <q-table
    v-else
    flat
    :pagination="pagination"
    class="q-pa-sm"
    :rows="productStore.rowDatas"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['id', 'name', 'description', 'msrp', 'srp', 'qrcode', 'action']
        : ['id', 'name', 'description', 'msrp', 'srp', 'qrcode', 'action']
    "
  >
    <template #body="props">
      <q-tr :props="props" v-if="props.row.type == 'Product'">
        <q-td key="id" :props="props">
          {{ props.row.sku }}
        </q-td>

        <q-td key="name" :props="props">
          <q-avatar>
            <q-img
              :src="props.row.product_img"
              v-if="props.row.product_img"
              width="50px"
            />
            <q-avatar
              v-else
              color="grey"
              text-color="white"
              icon="image_not_supported"
            >
              <!-- <img src="https://cdn.quasar.dev/img/avatar.png" /> -->
            </q-avatar>
          </q-avatar>
          {{ props.row.title }}
        </q-td>
        <q-td key="description" :props="props">
          {{ props.row.description }}
        </q-td>

        <q-td key="msrp" :props="props">
          {{ props.row.msrp }}
        </q-td>

        <q-td key="srp" :props="props">
          {{ props.row.price }}
        </q-td>
        <q-td key="qrcode" :props="props">
          <vue-qrcode
            :value="props.row.code"
            :options="{
              errorCorrectionLevel: 'Q',
              width: 100,
            }"
            @ready="onReady"
            :id="'qrcode_canvas' + props.row.sku"
            crossorigin="anonymous"
          ></vue-qrcode
          ><br />
          <q-btn
            dense
            flat
            label="download"
            color="green"
            icon="download"
            size="sm"
            @click="downloadFunc('qrcode_canvas' + props.row.sku)"
          />
          <!-- {{ props.row.code }} -->
        </q-td>
        <q-td key="barcode" :props="props">
          <!-- <vue-barcode
            :value="props.row.code"
            :options="{ lineColor: '#007bff' }"
          ></vue-barcode> -->
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="blue"
            icon="edit"
            label="edit"
            size="sm"
            @click="EditDialog(props.row.id)"
          />
          <!-- <q-btn
            color="green"
            icon="bar_chart"
            size="sm"
            :to="'/user/members/' + props.row.id + '/update-photo'"
          />

          <q-btn
            color="orange"
            icon="fastfood"
            size="sm"
            :to="'/branches/' + props.row.id + '/products'"
          />
          <q-btn
            color="secondary"
            icon="shopping_cart"
            size="sm"
            @click="passwordDialog(props.row.id)"
          />

          <q-btn
            color="info"
            icon="monitor"
            size="sm"
            @click="passwordDialog(props.row.id)"
          /> -->
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <!-- Edit Product -->
  <q-dialog v-model="showEditDialog">
    <EditProducts
      :product-id="product_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Capture Image -->

  <!-- Edit Member -->
</template>

<script setup>
import { api } from "src/boot/axios";
// import { useProductData } from "stores/products/productStore";
import { useProductDatas } from "stores/branch/productStores";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import EditProducts from "./EditProduct.vue";
import VueQrcode from "@chenfengyuan/vue-qrcode";
// import VueBarcode from "@chenfengyuan/vue-barcode";

const route = useRoute();

const productStore = useProductDatas();

const $q = useQuasar();

const code = ref(null);

const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const product_id = ref(null);

const onReady = (canvas) => {
  const context = canvas.getContext("2d");
  const image = new Image();

  // console.log(canvas);

  image.src = "https://avatars.githubusercontent.com/u/3456749";
  image.crossorigin = "anonymous";
  image.onload = () => {
    const coverage = 0.15;
    const width = Math.round(canvas.width * coverage);
    const x = (canvas.width - width) / 2;

    // drawImage(context, image, x, x, width, width);
  };
};

const drawImage = (context, image, x, y, width, height, radius = 4) => {
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 2;
  context.shadowBlur = 4;
  context.shadowColor = "#00000040";
  context.lineWidth = 8;
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
  context.strokeStyle = "#fff";
  context.stroke();
  context.clip();
  context.fillStyle = "#fff";
  context.fillRect(x, x, width, height);
  context.drawImage(image, x, x, width, height);
};

const downloadFunc = (id) => {
  // console.log(formData.code);
  var canvas = document.getElementById(id);
  // Convert the canvas to data
  var imageUrl = canvas.toDataURL();
  // Create a link
  var aDownloadLink = document.createElement("a");
  // Add the name of the file to the link
  aDownloadLink.download = id + ".png";
  // Attach the data to the link
  aDownloadLink.href = imageUrl;
  // Get the code to click the download link

  aDownloadLink.click();
};

const EditDialog = (id) => {
  product_id.value = "";
  showEditDialog.value = true;
  product_id.value = id;
};

const passwordDialog = (id) => {
  branch_id.value = "";
  showPasswordDialog.value = true;
  branch_id.value = id;
};
const capturedImg = (id) => {
  branch_id.value = "";
  showCaptureImg.value = true;
  branch_id.value = id;
};

const pagination = reactive({
  sortBy: "id",
  rowsPerPage: 10,
});
const columns = reactive([
  {
    name: "id",
    label: "SKU",
    field: "id",
    align: "left",
    sortable: true,
    classes: "bg-grey-4 text-black",
  },
  {
    name: "name",
    label: "Product Name",
    field: "name",
    align: "left",
    sortable: true,
  },

  {
    name: "description",
    label: "Description",
    field: "description",
    align: "left",
    sortable: true,
  },
  {
    name: "msrp",
    label: "MSRP",
    field: "msrp",
    align: "left",
    sortable: true,
  },
  {
    name: "srp",
    label: "SRP",
    field: "srp",
    align: "left",
    sortable: true,
  },
  {
    name: "qrcode",
    label: "Qrcode",
    field: "qrcode",
    align: "left",
    sortable: true,
  },

  {
    name: "barcode",
    label: "Barcode",
    field: "barcode",
    align: "left",
    sortable: true,
  },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
]);
const copyText = (code) => {
  navigator.clipboard.writeText(code);
  $q.notify({
    type: "positive",
    color: "positive",
    timeout: 1000,
    position: "top",
    message: "Copy Code: " + code,
  });
};
onMounted(() => {
  //   branchData.getAllStaff();
  //   productStore.getAllProducts();
});
</script>

<style></style>
