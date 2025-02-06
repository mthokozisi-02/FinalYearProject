import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlertService } from '.';
const cartStorageName = 'cart';

@Injectable({
  providedIn: 'root',
})
export class CartService   extends AlertService{
  orezonCart: any = [];
  updateTotal = new BehaviorSubject(false);
  toggleCart = new BehaviorSubject(false);

  constructor() {
    super()
  }

  saveToStorage() {
    localStorage.setItem(cartStorageName, JSON.stringify(this.orezonCart));
  }

  clearCart() {
    localStorage.removeItem(cartStorageName);
    this.toggleCart.next(false);
    this.updateTotal.next(true);

    setTimeout(() => {
      window.location.reload();
    }, 70000);
  }

  addToCart(product, amount, quantity) {
    const packet = {
      ...product,
      quantity: 1,
      amount: Number(amount * quantity),
    };
    this.orezonCart = this.getCurrentCart();
    console.log(product, product.id, this.orezonCart);
    const index = this.orezonCart?.findIndex((p) => p.id === product.id);
    console.log('index', index);
    if (index >= 0) {
      this.orezonCart[index].amount =
        this.orezonCart[index].amount + Number(amount * quantity);
      this.orezonCart[index].quantity = Number(
        this.orezonCart[index].quantity + quantity
      );
    } else {
      console.log('nooo');
      this.orezonCart.push(packet);
    }
    console.log(this.orezonCart[index]);
    this.saveToStorage();
    this.updateTotal.next(true);
  }

  subtractFromCart(product, amount, quantity) {
    const packet = {
      ...product,
      quantity: 1,
      amount: Number(amount * quantity),
    };
    this.orezonCart = this.getCurrentCart();
    console.log(product, product.id, this.orezonCart);
    const index = this.orezonCart?.findIndex((p) => p.id === product.id);
    console.log('index', index);
    if (index >= 0) {
      this.orezonCart[index].amount =
        this.orezonCart[index].amount - Number(amount * quantity);
      this.orezonCart[index].quantity = Number(
        this.orezonCart[index].quantity - quantity
      );
    } else {
      console.log('nooo');
      this.orezonCart.push(packet);
    }
    console.log(this.orezonCart[index]);
    this.saveToStorage();
    this.updateTotal.next(true);
  }

  removeFromCart(product) {
    const index = this.orezonCart?.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      console.log('entered');
      this.orezonCart.splice(index, 1);
    }
    this.saveToStorage();
    this.updateTotal.next(true);
  }

  getTotal(): number {
    this.setCart();
    let total = 0;
    this.orezonCart.forEach((product) => {
      let itemtotal = Number(product.price) * Number(product.quantity);
      total += Number(itemtotal);
    });
    return total;
  }

  getTotaltems(): number {
    this.setCart();
    return this.orezonCart.length;
  }

  getCurrentItemAmount(product): number {
    this.setCart();
    const index = this.orezonCart?.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      return this.orezonCart[index].amount;
    } else {
      return 0;
    }
  }

  getCurrentCart() {
    const savedCart = localStorage.getItem(cartStorageName);
    if (savedCart) {
      return JSON.parse(savedCart);
    } else {
      return [];
    }
  }

  setCart() {
    const savedCart = localStorage.getItem(cartStorageName);
    if (savedCart) {
      this.orezonCart = JSON.parse(savedCart);
    }
  }
}
