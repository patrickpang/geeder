import os

cwd = os.getcwd()
print(cwd)

print()

files = os.listdir(cwd)
for file in files:
    print(file)
