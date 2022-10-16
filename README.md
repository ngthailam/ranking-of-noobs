# Deeplink Feature

## Supported deeplinks  
**Deeplink Format** : `<scheme>://<host>/<path>?<query string>`  
**scheme** = `zalora`  
**host** = cc/country code (sg, tw, etc)  
**sample** :  `zalora://sg/cart?<query string>`

The following are the available deeplinks in the app:

| Key | Action/Screen | Ext Path | Parameters | Remarks | Example
|--|--|--|--|--|--|
| | homescreen | | | base deeplink | zalora://sg
| seg | homescreen | \<segment\> (men\|women) | |change segment (affected screens: HS, side menu) | zalora://sg/seg/m/men/
| d | PDV | \<sku\> | size | | zalora://sg/d/OB365AA47UZGSG
| urlc | catalog | products | any parameter for `GET /products`* | | zalora://sg/urlc/o/products/?segment=men&categoryId=4751&brandIds[]=1919&shop=o
| cart | cart | \<sku\> | size, redirect, fromModa | | zalora://tw/cart/OB365AA47UZGSG/?size=S
| w | wishlist | | | | zalora://sg/w
| o | my orders | | | requires login | zalora://sg/o
| os | order summary | \<order_number\> | | requires login | zalora://sg/os/256671821
| wlt | wallet | | | requires login | zalora://sg/wlt
| ~~ivt~~ | ~~fb invite~~ | | | deprecated
| l | login | | | redirect to HS if already logged in | zalora://sg/l
| r | register | | | redirect HS if already logged in| zalora://sg/r
| stc | static screen | \<CMS key\> | | | zalora://sg/stc/app-valentines-day
| mgz | magazine | | story | | zalora://sg/mgz?story=work-to-weekend-wear_985432
| cmy | community | | | | zalora://sg/cmy
| s | search | \<search term\> | | | zalora://sg/s/satin
| nb | native browser | \<external url\> | | | zalora://sg/nb/http%3A%2F%2Fwww.zalora.sg%2Fwomen%2Fshoes%2F
| ~~du~~ | product detail url | | | deprecated |
| ~~hiw~~ | help info web | | | deprecated |
| dj | datajet / discovery link | | | | zalora://sg/dj
| djp | personal datajet / discovery link | | |  | zalora://sg/djp
| b | brand | | | | zalora://sg/b/2192
|gtl| get the look | | | | zalora://sg/gtl?campaignId=1&segment=men
|contact| Contract US Detail | | | | zalora://sg/contact
| ot | order tracking | \<order_number\> | | requires login | zalora://sg/ot/256671821
| oc | order cancellation | \<order_number\> | | requires login | zalora://sg/oc/256671821
| rt | order Return | \<order_number\> | | requires login | zalora://sg/rt/256671821
| o | order confirmation | \<order_number\> | | requires login | zalora://sg/o/256671821

### Other Parameters
- *`GET /products` query parameters.
  - `shop` -  (`m`/`o`) filter by shop
  - `lang` - filter by language
  - `query` - COSTA search
  - `getSKU` - sticky SKU for catalog
- `vc` - voucher/promo code. Available in the following screens:
  - Cart
  - PDV
  - Catalog
  - Home Screen
  - Static screen

___Note: `_s` key suffix - directs to specific shop___(e.g., `zalora://sg/d_s/m/OB365AA47UZGSG` redirects to pdv **and** switch to outlet shop)


## References
- [Android deeplinking](https://developer.android.com/training/app-links/deep-linking)
- [PM Wiki](https://zalora.atlassian.net/wiki/spaces/PM/pages/43057163/App+deep+links)
- [QA Wiki](https://zalora.atlassian.net/wiki/spaces/ZQD/pages/125927511/Deeplinks)
- https://docs.google.com/spreadsheets/d/1Sn9cWCabsPxFbooeB4lo_ErPgv2_5DXe_zeVvcKfldA/


> Written with [StackEdit](https://stackedit.io/).