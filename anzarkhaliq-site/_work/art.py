import glob,os
from PIL import Image
base=os.path.expanduser('~/mnt/Downloads')
os.makedirs(base+'/anzarkhaliq-site/site/img/art',exist_ok=True)
for f in glob.glob(base+'/aksite-art-*.png'):
    n=os.path.basename(f)[len('aksite-art-'):-4]
    if n in ('thrive','thrive2'): continue
    n={'thrive3':'thrive'}.get(n,n)
    out=base+'/anzarkhaliq-site/site/img/art/%s.webp'%n
    if os.path.exists(out): continue
    im=Image.open(f).convert('RGB'); im.thumbnail((2000,2000)); im.save(out,'WEBP',quality=82)
    p=im.copy(); p.thumbnail((900,900)); p.save(base+'/anzarkhaliq-site/_work/prev-%s.jpg'%n,quality=80)
    print(n,im.size,os.path.getsize(out)//1024,'KB')
