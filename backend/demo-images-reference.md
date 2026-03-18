# Demo images – exact 8 inspection photos

FleetGuard requires **8 photos per inspection** (schema + AI `PHOTO_LABELS`):

| # | photo_type | Description | Demo file |
|---|------------|-------------|-----------|
| 1 | **front**  | Front View – full car front | `front.jpg` |
| 2 | **rear**   | Rear View – full car rear/bumper | `rear.jpg` |
| 3 | **left**   | Left Side – car left profile | `left.jpg` |
| 4 | **right**  | Right Side – car right profile | `right.jpg` |
| 5 | **interior** | Interior – cabin, seats, steering | `interior.jpg` |
| 6 | **dashboard** | Dashboard – steering + instruments | `dashboard.jpg` |
| 7 | **odometer** | Odometer / Additional View – gauge close-up | `odometer.jpg` |
| 8 | **damage** | Damage Close-up – **dent, scratch or crash (easy to identify)** | `damage.jpg` |

## Damage images (real, easy to identify)

- **damage.jpg** – White car with damaged front bumper (dent/scratch)  
  `https://images.unsplash.com/photo-1760804462351-212877c1d4e5?w=800`
- **damage2.jpg** – Smashed front end (crash, very obvious)  
  `https://images.unsplash.com/photo-1666094240666-66530dde9101?w=800`

## All 8 inspection image URLs (Unsplash)

| Save as | URL |
|--------|-----|
| front.jpg | https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800 |
| rear.jpg | https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800 |
| left.jpg | https://images.unsplash.com/photo-1502877338530-7667bfa8246e?w=800 |
| right.jpg | https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800 |
| interior.jpg | https://images.unsplash.com/photo-1732399962053-07138c18370e?w=800 |
| dashboard.jpg | https://images.unsplash.com/photo-1645095117583-541b1de184a2?w=800 |
| odometer.jpg | https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800 |
| damage.jpg | https://images.unsplash.com/photo-1760804462351-212877c1d4e5?w=800 |

## Vehicle fleet (5) + signature

Same script also downloads `vehicle-1.jpg` … `vehicle-5.jpg` and `signature.png` into `backend/uploads/demo/`.

## Re-download

```bash
cd backend
npm run demo:images
```

Files are written to **`backend/uploads/demo/`** with the exact names above so the seed and app can use them.
