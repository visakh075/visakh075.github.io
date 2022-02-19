import os
dir_list = os.listdir(".")
js=open("../list_array.js","w")
js.write("var icon_list=[")
idx=0
for file in dir_list:
    if file.endswith(".svg"):
        ent='['+str(idx)+',"'+file+'"],'
        js.write(ent)
        idx+=1
js.write("]")
