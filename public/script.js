const LOAD_RECORDS = 10;

new Vue({
    el: '#app',
    data: {
        searchTerm: 'anime',
        oldSearchTerm: '',
        total: 0,
        itemPrice: 9.99,
        items: [],
        results: [],
        cart: [],
        loading: false
    },
    methods: {
        addItem(index){
           this.total += this.itemPrice;
           let itemFound = false;
           
           this.cart.forEach(item => {
                   if(item.title === this.items[index].title){
                       item.qty++;
                       itemFound = true;
                   }
               });
            
           if(!itemFound) {
                 this.cart.push({
                   id: this.items[index].id ,
                   title: this.items[index].title ,
                   qty: 1
               })

               
            }
           
        },
        increaseQty(index){
            let item = this.cart[index];
            this.total += this.itemPrice;            
            item.qty++;
    
        },
        decreaseQty(index){
            let item = this.cart[index];            
            this.total -= this.itemPrice;            
            item.qty--;
            if(item.qty <= 0) {
                this.cart.splice(index,1)
            }
        },
        search(){
           if(this.searchTerm){
               this.items = [];
               this.loading = true;
               this.$http.get('/search/'.concat(this.searchTerm))
                     .then(response => {
                         this.results = response.data;
                         this.appendItems();
                         this.oldSearchTerm = this.searchTerm;
                         this.loading = false;
                         
                     })
           }else {
               alert('Please enter something to search.')
           }
        },
        appendItems(){
            if(this.items.length < this.results.length) {
                this.items = this.results.slice(0,this.items.length + LOAD_RECORDS)
            }            
        }
    },
    computed: {
        noMoreItems: function(){
            return this.results.length === this.items.length && this.results.length > 0
        }
    },
    filters: {
        currency(price){
            return '$' + price.toFixed(2);
        }   
    },
    mounted(){
        this.search();

        let element = document.getElementById("products-list-bottom");
        let watcher = scrollMonitor.create(element);
        watcher.enterViewport(() => this.appendItems());
    }
})





