'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Heart, Plus, Minus, ShoppingBag, ZoomIn, X, Check } from 'lucide-react';
import './ingram-bookstore.css';

type Edition={id:string;label:string;available:boolean;purchaseUrl?:string;price?:number;currency?:string;availabilityNote?:string};
type Book={slug:string;title:string;cover:string;genre:string;description:string;tagline?:string;formats:Edition[];isbn?:string};
type Selection={slug:string;format:string;quantity:number};
const BAG_KEY='dennis-ingram-selections-v1';
const WISH_KEY='dennis-ingram-wishlist-v1';
function read<T>(key:string,initial:T):T{try{const value=localStorage.getItem(key);return value?JSON.parse(value) as T:initial;}catch{return initial;}}
function write<T>(key:string,value:T){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
function checkoutLink(format:Edition|undefined){
  if(!format?.available||!format.purchaseUrl)return null;
  try{const url=new URL(format.purchaseUrl);return url.protocol==='https:'&&url.hostname==='shop.ingramspark.com'?format.purchaseUrl:null;}catch{return null;}
}
export function IngramBookstore({book}:{book:Book}){
  const [selected,setSelected]=useState(book.formats[0]?.id||'');
  const [quantity,setQuantity]=useState(1);
  const [favorites,setFavorites]=useState<string[]>([]);
  const [bag,setBag]=useState<Selection[]>([]);
  const [loaded,setLoaded]=useState(false);
  const [modal,setModal]=useState<'cover'|'bag'|null>(null);
  const [message,setMessage]=useState('');
  useEffect(()=>{setFavorites(read(WISH_KEY,[]));setBag(read(BAG_KEY,[]));setLoaded(true);},[]);
  useEffect(()=>{if(!modal)return;const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape')setModal(null);};document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey);},[modal]);
  const format=book.formats.find(item=>item.id===selected);
  const href=checkoutLink(format);
  const liked=favorites.includes(book.slug);
  function saveWish(){const updated=liked?favorites.filter(x=>x!==book.slug):[...favorites,book.slug];setFavorites(updated);write(WISH_KEY,updated);setMessage(liked?'Removed from wishlist':'Saved to wishlist');}
  function addBag(){if(!format)return;const item=bag.find(x=>x.slug===book.slug&&x.format===selected);const updated=item?bag.map(x=>x===item?{...x,quantity:Math.min(10,x.quantity+quantity)}:x):[...bag,{slug:book.slug,format:selected,quantity}];setBag(updated);write(BAG_KEY,updated);setModal('bag');}
  function removeBag(item:Selection){const updated=bag.filter(x=>!(x.slug===item.slug&&x.format===item.format));setBag(updated);write(BAG_KEY,updated);}
  return <section className="dr-store" aria-label={book.title+' bookstore'}>
    <div className="dr-store-grid">
      <div className="dr-store-gallery">
        <p className="dr-store-eyebrow">THE COLLECTION / COVER GALLERY</p>
        <button className="dr-store-cover" type="button" onClick={()=>setModal('cover')} aria-label="Enlarge book cover">
          <Image src={book.cover} alt={book.title+' front cover'} fill priority sizes="(max-width:768px) 90vw, 42vw"/>
          <span><ZoomIn size={17}/> View cover</span>
        </button>
        <div className="dr-store-gallery-caption">
          <span>01 — FRONT COVER</span><span>Back cover and interior previews awaiting approved assets</span>
        </div>
      </div>
      <div className="dr-store-info">
        <p className="dr-store-eyebrow">{book.genre.toUpperCase()} / DENNIS ROSS</p>
        <h1>{book.title}</h1>
        <p className="dr-store-author">A novel by Dennis Ross</p>
        {book.tagline&&<p className="dr-store-tagline">{book.tagline}</p>}
        <div className="dr-store-description">{book.description.split('\n\n').map((p,i)=><p key={i}>{p}</p>)}</div>
        <div className="dr-store-shop" id="purchase">
          <div className="dr-store-heading"><span>SELECT YOUR EDITION</span><span>{String(book.formats.length).padStart(2,'0')} FORMATS</span></div>
          <div className="dr-store-editions" role="group" aria-label="Edition selection">
            {book.formats.map(item=><button key={item.id} type="button" aria-pressed={selected===item.id} onClick={()=>{setSelected(item.id);setMessage('');}} className={selected===item.id?'is-selected':''}>
              <strong>{item.label}</strong><small>{checkoutLink(item)?'Available to order':'Purchase link pending verification'}</small>
              {selected===item.id&&<Check size={17} aria-hidden="true"/>}
            </button>)}
          </div>
          <p className="dr-store-price-note">Final edition pricing is confirmed at IngramSpark checkout. No unverified discounts are advertised.</p>
          <div className="dr-store-tools">
            <div className="dr-store-qty"><button type="button" aria-label="Decrease saved quantity" disabled={quantity<=1} onClick={()=>setQuantity(x=>Math.max(1,x-1))}><Minus size={16}/></button><output>{quantity}</output><button type="button" aria-label="Increase saved quantity" disabled={quantity>=10} onClick={()=>setQuantity(x=>Math.min(10,x+1))}><Plus size={16}/></button></div>
            <button type="button" className="dr-store-outline" aria-pressed={liked} onClick={saveWish} disabled={!loaded}><Heart size={17} fill={liked?'currentColor':'none'}/>{liked?'Wishlisted':'Save to wishlist'}</button>
          </div>
          <div className="dr-store-actions">
            {href?<a className="dr-store-primary" target="_blank" rel="noopener noreferrer" href={href}>Buy {format?.label} on IngramSpark <ArrowUpRight size={18}/></a>:<button className="dr-store-primary" disabled type="button">Buy Now — Edition link unverified</button>}
            <button className="dr-store-outline" type="button" disabled={!loaded||!format} onClick={addBag}><ShoppingBag size={18}/> Save selection ({bag.length})</button>
          </div>
          <Link className="dr-store-sample-button" href="/sample/the-lethal-elixir/">
            Read a Sample <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <p className="dr-store-price-note">Secure checkout through IngramSpark. This selection bag is not a payment cart; quantities and payment are finalized on IngramSpark.</p>
          <p className="dr-store-live" role="status">{message}</p>
        </div>
        <div className="dr-store-details">
          <details><summary>About the book <Plus size={17}/></summary><div>{book.description.split('\n\n').map((p,i)=><p key={i}>{p}</p>)}</div></details>
          <details><summary>Book information <Plus size={17}/></summary><div><p>Author: Dennis Ross</p><p>Genre: {book.genre}</p>{book.isbn&&<p>ISBN: {book.isbn}</p>}<p>Editions: {book.formats.map(f=>f.label).join(', ')}</p><p>Other edition details are pending verification.</p></div></details>
          <details><summary>Ordering and delivery <Plus size={17}/></summary><div><p>Purchases are completed on IngramSpark, which confirms shipping, availability, and final pricing.</p></div></details>
          
          <details><summary>Reader reviews <Plus size={17}/></summary><div><p>Read existing reviews from readers of The Lethal Elixir.</p><Link href="/reviews">Explore reader reviews <ArrowUpRight size={15}/></Link></div></details>
        </div>
      </div>
    </div>
    {modal==='cover'&&<div className="dr-store-backdrop" onMouseDown={e=>{if(e.currentTarget===e.target)setModal(null);}}><div className="dr-store-modal" role="dialog" aria-modal="true" aria-label="Enlarged front cover"><button className="dr-store-close" type="button" autoFocus onClick={()=>setModal(null)} aria-label="Close cover"><X/></button><div className="dr-store-large-cover"><Image src={book.cover} alt={book.title+' cover enlarged'} fill sizes="80vw"/></div></div></div>}
    {modal==='bag'&&<div className="dr-store-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(null);}}><aside className="dr-store-drawer" role="dialog" aria-modal="true" aria-label="Saved book selections"><header><h2>Your selections</h2><button type="button" autoFocus aria-label="Close bag" onClick={()=>setModal(null)}><X/></button></header>{bag.length?bag.map(item=>{const edition=item.slug===book.slug?book.formats.find(f=>f.id===item.format):undefined;const link=checkoutLink(edition);return <div key={item.slug+item.format} className="dr-store-bag-line"><strong>{item.slug===book.slug?book.title:item.slug}</strong><p>{edition?.label||item.format} · Quantity {item.quantity}</p><button type="button" onClick={()=>removeBag(item)}>Remove</button>{link?<a href={link} target="_blank" rel="noopener noreferrer">Buy individually on IngramSpark <ArrowUpRight size={15}/></a>:<span>Purchase URL pending verification</span>}</div>;}):<p>Your selection bag is empty.</p>}<p className="dr-store-price-note">This is not a multi-item checkout. Each edition is purchased separately through IngramSpark.</p></aside></div>}
  </section>;
}
