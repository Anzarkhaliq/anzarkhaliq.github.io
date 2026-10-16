import glob,os
from PIL import Image
base=os.path.expanduser('~/mnt/Downloads')
for f in glob.glob(base+'/aksite-art-*.png'):
    n=os.path.basename(f)[len('aksite-art-'):-4]
    if n in ('thrive','thrive2'): continue
    n={'thrive3':'thrive'}.get(n,n)
    im=Image.open(f).convert('RGB')
    course=n in ('thrive','communicate','methods','energy')
    im.thumbnail((1200,1200) if course else (1800,1800))
    out=base+'/anzarkhaliq-site/site/img/art/%s.webp'%n
    im.save(out,'WEBP',quality=76,method=6)
    print(n,im.size,os.path.getsize(out)//1024,'KB')
